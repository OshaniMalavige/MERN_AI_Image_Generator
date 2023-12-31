import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saberToast } from '../toast'
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';
import './toast.css'

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://imagegenerator-i032.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        saberToast.error({
          title: "Error Occurred",
          text: err,
          delay: 200,
          duration: 2600,
          rtl: true,
          position: "bottom-right"
        })
      } finally {
        setGeneratingImg(false);
      }
    } else {
      saberToast.info({
        title: "Fill in the Blanks",
        text: "Please provide proper prompt",
        delay: 200,
        duration: 2600,
        rtl: true,
        position: "bottom-right"
      })
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://imagegenerator-i032.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        saberToast.success({
          title: "Success",
          text: "Your image has been published",
          delay: 200,
          duration: 2600,
          rtl: true,
          position: "bottom-right"
        })
        navigate('/');
      } catch (err) {
        saberToast.error({
          title: "Error Occurred",
          text: err,
          delay: 200,
          duration: 2600,
          rtl: true,
          position: "bottom-right"
        });
      } finally {
        setLoading(false);
      }
    } else {
      saberToast.error({
        title: "Syntax Error",
        text: "Please generate an image with proper details",
        delay: 200,
        duration: 2600,
        rtl: true,
        position: "bottom-right"
      })
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#333333] text-[32px] text-center">Generate an imaginative image and share it with the community</h1>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex. Amandi Perera"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A man wanders through the rainy streets of Tokyo, with bright neon signs, 50mm..."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white hover:bg-[#006400] bg-emerald-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#757575] text-[14px]">** Share it with others in the community !**</p>
          <button
            type="submit"
            className="mt-3 text-white hover:bg-blue-700 bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
