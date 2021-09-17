import DataParsingService from './DataParsingService';
declare var test;
declare var expect;

test("Parse 'Upgrade with:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade with:");
    expect(upgrade).not.toBeNull();
});