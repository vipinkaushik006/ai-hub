import { useState } from "react";
import api from "../utils/api";

export default function AdminCreateBlog() {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Programming",
    author: "69dd36173628bb13a813be0e" // 👉 apna USER_ID
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/blogs", form);
      alert("Blog Created ✅");
      setForm({
        title: "",
        excerpt: "",
        content: "",
        category: "Programming",
        author: form.author
      });
    } catch (err) {
      alert("Error creating blog ❌");
    }
  };

  return (
    <div className="pt-24 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Create Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-600 rounded"
        />

        <input
          type="text"
          name="excerpt"
          placeholder="Short Description"
          value={form.excerpt}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-600 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-600 rounded"
        >
          <option>AI Tools</option>
          <option>Programming</option>
          <option>Career</option>
          <option>Tutorials</option>
          <option>News</option>
          <option>Analytics</option>
        </select>

        <textarea
          name="content"
          placeholder="Write full blog here (Markdown supported)"
          value={form.content}
          onChange={handleChange}
          rows={10}
          className="w-full p-3 bg-black border border-gray-600 rounded"
        />

        <button className="bg-blue-500 px-6 py-3 rounded">
          Publish Blog 🚀
        </button>

      </form>
    </div>
  );
}