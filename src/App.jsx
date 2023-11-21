import { useEffect, useMemo, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const savedTheme = window.localStorage.getItem("theme") || "light";
  const savedAspectRatio = window.localStorage.getItem("aspect-ratio") || "1:1";
  const savedImage = useMemo(
    () => window.localStorage.getItem("image") || null,
    []
  );
  const imageOptionsInitialState = {
    objectFit: "contain",
  };
  const savedImageOptions = useMemo(
    () =>
      JSON.parse(window.localStorage.getItem("imageOptions")) ||
      imageOptionsInitialState,
    []
  );
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState(savedTheme);
  const [aspectRatio, setAspectRatio] = useState(savedAspectRatio);
  const [image, setImage] = useState(savedImage);
  const [imageOptions, setImageOptions] = useState(savedImageOptions);
  const imageRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  function gcd(a, b) {
    if (b > a) {
      temp = a;
      a = b;
      b = temp;
    }
    while (b != 0) {
      let m = a % b;
      a = b;
      b = m;
    }
    return a;
  }

  /* ratio is to get the gcd and divide each component by the gcd, then return a string with the typical colon-separated value */
  function ratio(x, y) {
    let c = gcd(x, y);
    return "" + x / c + ":" + y / c;
  }

  useEffect(() => {
    if (imageRef.current) {
      const img = new Image();
      img.src = imageRef.current.src;
      img.onload = () => {
        var stringLength =
          imageRef.current.src.length - "data:image/png;base64,".length;

        var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
        var sizeInKb = sizeInBytes / 1000;
        const aspectRatio = ratio(img.width, img.height);
        setImageData({
          width: img.width,
          height: img.height,
          aspectRatio: aspectRatio,
          size: (sizeInKb/1000).toFixed(1),
        });
      };
    }
  }, [imageRef.current]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const br = 350;

  const returnResolution = (aspectRatio) => {
    let ratio = aspectRatio.split(":")[0] / aspectRatio.split(":")[1];
    if (ratio < 1) return [br, br / ratio];
    return [br * ratio, br];
  };

  const handleAspectRatioChange = (e) => {
    setAspectRatio(e.target.value);
    window.localStorage.setItem("aspect-ratio", e.target.value);
  };

  const width = useMemo(() => returnResolution(aspectRatio)[0], [aspectRatio]);
  const height = useMemo(() => returnResolution(aspectRatio)[1], [aspectRatio]);

  const handleImageInput = (e) => {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      setImage(reader.result);
      window.localStorage.setItem("image", reader.result);
    });
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleImageOptionsChange = (e) => {
    setImageOptions({
      ...imageOptions,
      objectFit: e.target.value,
    });
    window.localStorage.setItem(
      "imageOptions",
      JSON.stringify({
        ...imageOptions,
        objectFit: e.target.value,
      })
    );
  };

  return (
    <>
      <div className="textContainer-right">
        <div>
          Theme &nbsp;
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
        <div>
          Container Aspect Ratio &nbsp;
          <select value={aspectRatio} onChange={handleAspectRatioChange}>
            <option value="4:5">4:5</option>
            <option value="1:1">1:1</option>
            <option value="4:3">4:3</option>
            <option value="3:2">3:2</option>
            <option value="16:9">16:9</option>
            <option value="21:9">21:9</option>
          </select>
        </div>
      </div>
      <br />
      <div
        className="background"
        style={{
          width: width,
          height: height,
          border: "1px solid black",
          display: "block",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          ref={imageRef}
          alt="image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: imageOptions.objectFit,
          }}
        />
      </div>
      {imageData && (
        <div
          className="doubleTextContainer"
          style={{ textAlign: "left", fontSize: 15 }}
        >
          <div className="textContainer-left">
            <div>width: {imageData.width}px</div>
            <div>height: {imageData.height}px</div>
          </div>
          <div className="textContainer-right">
            <div>aspect ratio: {imageData.aspectRatio}</div>
            <div>size: {imageData.size}Mb</div>
          </div>
        </div>
      )}
      <br />
      <div className="doubleTextContainer">
        <div className="textContainer-left">
          <label htmlFor="imageUpload">Upload Image: </label>
          <input
            id="imageUpload"
            type="file"
            name="myImage"
            style={{ width: "180px" }}
            onChange={handleImageInput}
          ></input>
        </div>
        <br />
        <div className="textContainer-right">
          <div>Image options</div>
          <div>
            Image Fit &nbsp;
            <select
              value={imageOptions.objectFit}
              onChange={handleImageOptionsChange}
            >
              <option value="contain">Contain</option>
              <option value="cover">Cover</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
