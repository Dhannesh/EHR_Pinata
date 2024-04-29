import axios from "axios";
import { useState } from "react";
import Loader from "./Loader";
import Form from "./Form";

function App() {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fileData = new FormData();
      fileData.append("file", file);
      const respData = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      });
      const fileURL = `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${
        respData.data.IpfsHash
      }?pinataGatewayToken=${import.meta.env.VITE_GATEWAY_TOKEN}`;
      setLoading(false);
      setCid(fileURL);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="text-center bg-sky-50 p-5">
      <h1 className="text-4xl">Hello Pinata, Upload your file</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <button type="submit" className="bg-gray-400 p-2 rounded-md mt-2 mb-4">
          Upload
        </button>
      </form>
      {loading ? (
        <Loader />
      ) : (
        cid && (
          <a
            target="_new"
            className="bg-sky-700 text-white px-5 py-2 m-5 rounded-md"
            href={cid}>
            See the data on IPFS
          </a>
        )
      )}
      <Form />
    </div>
  );
}

export default App;
