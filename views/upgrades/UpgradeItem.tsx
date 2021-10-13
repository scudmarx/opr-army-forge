import { ISelectedUnit, IUpgrade, IUpgradeGains, IUpgradeOption, IUpgradeGainsWeapon, IUpgradeGainsItem, IUpgradeGainsRule } from '../../data/interfaces';
import EquipmentService from '../../services/EquipmentService';
import UpgradeService from '../../services/UpgradeService';
import UpgradeRadio from './controls/UpgradeRadio';
import UpgradeCheckbox from './controls/UpgradeCheckbox';
import UpgradeUpDown from './controls/UpgradeUpDown';
import { Fragment } from 'react';
import { groupBy } from '../../services/Helpers';
import pluralise from "pluralize";
import RulesService from '../../services/RulesService';
import UnitService from '../../services/UnitService';

export default function UpgradeItem({ selectedUnit, upgrade, option }: { selectedUnit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption }) {

  const controlType = UpgradeService.getControlType(selectedUnit, upgrade);
  // Somehow display the count?
  const gainsGroups = option ? groupBy(option.gains, "name") : null;
  const isValid = option ? UpgradeService.isValid(selectedUnit, upgrade, option) : true;

  return (
    <div className="is-flex is-align-items-center mb-1">
      <div className="is-flex-grow-1 pr-2">

        {
          gainsGroups ? Object.keys(gainsGroups).map((key, i) => {
            const group: IUpgradeGains[] = gainsGroups[key];
            const e = group[0];
            const count = group.length

            if (e.type === "ArmyBookRule") {
              return (
                <Fragment key={i}>
                  <span style={{ color: "#000000" }}>{e.label}</span>
                </Fragment>
              );
            }

            const name = count > 1 ? pluralise.plural(e.name || e.label) : e.name || e.label;

            const display = (eqp) => {
              switch (eqp.type) {
                case "ArmyBookRule": {
                  return (
                    <Fragment key={i}>
                      <span style={{ color: "#000000" }}>{e.label}</span>
                    </Fragment>
                  );
                }
                case "ArmyBookWeapon": {
                  const weapon = eqp as IUpgradeGainsWeapon;
                  const range = weapon && weapon.range ? `${weapon.range}"` : null;
                  const attacks = weapon && weapon.attacks ? `A${weapon.attacks}` : null;
                  return (
                    <Fragment key={i}>
                      {count > 1 && <span>{count}x </span>}
                      <span style={{ color: "#000000" }}>{name} </span>
                      <span className="mr-2" style={{ color: "#656565" }}>
                        ({[range, attacks].concat(weapon.specialRules.map(RulesService.displayName)).filter(r => !!r).join(", ")})
                      </span>
                    </Fragment>
                  );
                }
                case "ArmyBookItem": {
                  const item = eqp as IUpgradeGainsItem;
                  return (
                    <Fragment key={i}>
                      {count > 1 && <span>{count}x </span>}
                      <span style={{ color: "#000000" }}>{name} </span>
                      <span className="mr-2" style={{ color: "#656565" }}>
                        {item.content.map(c => display(c))}
                        {/* ({[range, attacks].concat(weapon.specialRules.map(RulesService.displayName)).filter(r => !!r).join(", ")}) */}
                      </span>
                    </Fragment>
                  );
                }
              }
            }
            // return {
            //   name: name,
            //   rules: [range, attacks] // Range, then attacks
            //     .concat(specialRules.map(RulesService.displayName)) // then special rules
            //     .filter((m) => !!m) // Remove empty/null entries
            //     .join(", ") // csv
            // }

            const parts = EquipmentService.getStringParts(e, count);
            return (
              <Fragment key={i}>
                {count > 1 && <span>{count}x </span>}
                <span style={{ color: "#000000" }}>{parts.name} </span>
                {parts.rules && <span className="mr-2" style={{ color: "#656565" }}>({parts.rules})</span>}
              </Fragment>
            );
          }) : <span style={{ color: "#000000" }}>None</span>
        }
      </div>
      <div>{option?.cost ? `${option.cost * (selectedUnit.combined && upgrade.affects === "all" ? 2 : 1)}pts` : "Free"}&nbsp;</div>
      {(() => {
        switch (controlType) {
          case "check": return <UpgradeCheckbox selectedUnit={selectedUnit} upgrade={upgrade} option={option} />;
          case "radio": return <UpgradeRadio selectedUnit={selectedUnit} upgrade={upgrade} option={option} isValid={isValid} />;
          case "updown": return <UpgradeUpDown selectedUnit={selectedUnit} upgrade={upgrade} option={option} />;
        }
      })()}
    </div>
  );
}