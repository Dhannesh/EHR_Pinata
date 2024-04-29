import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import Loader from "./Loader";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = {
        name,
        age,
        gender,
        bloodType,
        allergies,
        diagnosis,
        treatment,
      };
      const blob = new Blob([userData], { type: "text/plain" });
      const fileData = new FormData();
      fileData.append("file", blob);
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
      setName("");
      setAge("");
      setGender("");
      setBloodType("");
      setAllergies("");
      setDiagnosis("");
      setTreatment("");
      //   enqueueSnackbar("Record added successfully", { variant: "success" });
    } catch (error) {
      setLoading(false);
      console.log(error);
      //   enqueueSnackbar("Error", { variant: "error" });
    }
  };
  return (
    <>
      {
        <div className=" my-4 flex flex-col border-2 border-sky-400 rounded-xl w-[800px] p-4 mx-auto">
          <form onSubmit={submitHandler}>
            <h1 className="w-full bg-sky-500 p-4 rounded-md text-2xl text-white">
              Patient Details
            </h1>
            <div className="flex items-center w-full">
              <div className="my-2 mx-4 w-full">
                <label className="mr-4 float-left">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-gray-300  px-4 py-2 w-full"
                />
              </div>
              <div className="my-2 mx-4 w-full">
                <label className="mr-4 float-left">Age</label>
                <input
                  type="number"
                  name="age"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border-2 border-gray-300  px-4 py-2 w-full"
                />
              </div>
            </div>
            <div className="flex items-center w-full">
              <div className="my-2 mx-4 w-full">
                <label className="mr-4 float-left">Gender</label>
                <select
                  className="border-2 border-gray-300  px-4 py-2 w-full"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="my-2 mx-4 w-full">
                <label className="mr-4 float-left">Blood Type</label>
                <select
                  className="border-2 border-gray-300  px-4 py-2 w-full"
                  name="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  required>
                  <option value="">Select Blood Type</option>
                  <option value="O -ve">O -Ve</option>
                  <option value="O +ve">O +Ve</option>
                  <option value="A -ve">A -Ve</option>
                  <option value="A +ve">A +Ve</option>
                  <option value="B +ve">B +Ve</option>
                  <option value="B -ve">B -Ve</option>
                  <option value="AB +ve">AB +Ve</option>
                  <option value="AB -ve">AB -Ve</option>
                </select>
              </div>
            </div>
            <div className="flex items-center w-full">
              <div className="my-2 mx-4 w-full">
                <label className="mr-4 float-left">Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  required
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="border-2 border-gray-300  px-4 py-2 w-full"
                />
              </div>
              <div className="my-2 mx-4 w-full">
                <label className="mr-4 float-left">Diagnosis</label>
                <input
                  type="text"
                  name="diagnosis"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="border-2 border-gray-300  px-4 py-2 w-full"
                />
              </div>
            </div>
            <div className="flex items-center w-full">
              <div className="my-2 mx-4 w-full">
                <label className="mr-4 float-left">Treatment</label>
                <textarea
                  name="treatment"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="border-2 border-gray-300  px-4 py-2 w-full resize-none rounded-md"></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2 my-0 bg-sky-900 text-white font-bold rounded-md">
              Save
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
        </div>
      }
    </>
  );
};
export default Form;
