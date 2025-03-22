import React, { useState } from "react";

const About = () => {
  const skillsData = {
    "Programming Languages": ["Java", "C#", "Python", "SQL", "React JS", "JavaScript"],
    "Frameworks & Tools": ["Visual Studio", "Git"],
  };

  const [keyword, setKeyword] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  // Combine all skills for default display
  const allSkills = Object.values(skillsData).flat();

  // Filter skills based on keyword and category
  const filteredSkills = allSkills.filter((skill) => {
    const matchesKeyword = skill.toLowerCase().includes(keyword.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || skillsData[selectedCategory]?.includes(skill);
    return matchesKeyword && matchesCategory;
  });

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4" id="main-content">About Me</h1>

      {/* Education Section */}
      <section className="mb-5">
        <h2>Education</h2>
        <div className="bg-light p-4 rounded">
          <h3>Dalhousie University</h3>
          <p>
            <strong>Bachelor of Computer Science</strong> (2022 - 2026)
          </p>
          <ul>
            <li>Coursework: Data Structures and Algorithms, Computational Theory, Network Computing</li>
          </ul>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className="mb-5">
        <h2>Technical Skills</h2>
        <div className="bg-light p-4 rounded">
          {/* Search Bar and Category Dropdown on the Same Line */}
          <div className="row mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {Object.keys(skillsData).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Display Filtered Skills */}
          <h3>Skills</h3>
          <ul className="list-group">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index) => (
                <li key={index} className="list-group-item">
                  {skill}
                </li>
              ))
            ) : (
              <li className="list-group-item">No skills found.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Career Goals Section */}
      <section className="mb-5">
        <h2>Career Goals</h2>
        <div className="bg-light p-4 rounded">
          <p>
            I am passionate about technology and software development, with a particular interest in
            full-stack development and quality assurance. My goal is to contribute to innovative
            projects that solve real-world problems while continuously improving my technical skills
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;