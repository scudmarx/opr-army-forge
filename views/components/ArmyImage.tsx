const rotations = {} as any;

export default function ArmyImage({ name }) {
  return (
    <div className="is-flex p-2" style={{ position: "relative", height: "100px", boxSizing: "content-box" }}>
      <div style={{
        zIndex: 0,
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url("img/army_bg.png")`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: 'no-repeat',
        transform: `rotate(${rotations[name] || (rotations[name] = 360 * Math.random())}deg)`
      }}></div>
      <div className="is-flex" style={{
        height: "100px",
        width: "100%",
        backgroundImage: `url("img/gf_armies/${name}.png")`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: 'no-repeat',
        position: "relative", zIndex: 1
      }}></div>
    </div>
  );
}