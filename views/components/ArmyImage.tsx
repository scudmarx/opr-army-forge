import { useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { RootState } from '../../data/store'
const rotations = {} as any;


export default function ArmyImage({ name }) {
  const url = `img/gf_armies/${name}.png`
  const army = useSelector((state: RootState) => state.army);
  const [img, setImg] = useState(null)
  useEffect( () => {
    fetch(url)
    .then(
      (data) => {
        if (data.ok) {
          //console.log("got an image", data);
          let b = data.blob().then(blob => {
            setImg(URL.createObjectURL(blob))
          })
        } else {
          //console.log("didn't get an image, trying web.");
          setImg(army?.data?.coverImagePath || "img/AF_logo.svg")
        }
      })
     //console.log(army)
    }, [army]
  )
  
  
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
        backgroundImage: `url(${img})`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: 'no-repeat',
        position: "relative", zIndex: 1
      }}></div>
    </div>
  );
}