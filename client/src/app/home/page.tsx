"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import AddProject from "../../components/AddProjectModal";

interface Project {
  projectName: string;
  project_description: string;
  project_image: string;
  category: "group" | "individual";
}

const projectlist: Project[] = [
  {
    projectName: "Ecommerce",
    project_description:
      "A website that allows people to buy and sell physical goods, services, and digital products over the internet.",
    project_image: "/Angry-Photoroom.png",
    category: "group",
  },
  {
    projectName: "CHAT APP",
    project_description:
      "A platform where users can communicate in real-time with advanced encryption and group chat features.",
    project_image: "/Credit-Card.jpg",
    category: "individual",
  },
  {
    projectName: "ScrumX",
    project_description:
      "A project management tool for agile teams to track tasks, collaborate, and manage workflows seamlessly.",
    project_image: "/Welcome-removebg-preview.png",
    category: "group",
  },
  {
    projectName: "Ecommerce",
    project_description:
      "A website that allows people to buy and sell physical goods, services, and digital products over the internet.",
    project_image: "/Angry-Photoroom.png",
    category: "group",
  },
  {
    projectName: "CHAT APP",
    project_description:
      "A platform where users can communicate in real-time with advanced encryption and group chat features.",
    project_image: "/Credit-Card.jpg",
    category: "individual",
  },
  {
    projectName: "ScrumX",
    project_description:
      "A project management tool for agile teams to track tasks, collaborate, and manage workflows seamlessly.",
    project_image: "/Welcome-removebg-preview.png",
    category: "group",
  },
  {
    projectName: "Ecommerce",
    project_description:
      "A website that allows people to buy and sell physical goods, services, and digital products over the internet.",
    project_image: "/Angry-Photoroom.png",
    category: "individual",
  },
  {
    projectName: "CHAT APP",
    project_description:
      "A platform where users can communicate in real-time with advanced encryption and group chat features.",
    project_image: "/Credit-Card.jpg",
    category: "individual",
  },
  {
    projectName: "ScrumX",
    project_description:
      "A project management tool for agile teams to track tasks, collaborate, and manage workflows seamlessly.",
    project_image: "/Angry-Photoroom.png",
    category: "group",
  },
];

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIndividual, setIsIndividual] = useState(false);

  return (
    <div className="h-screen bg-offWhite p-8 overflow-y-auto scrollbar-hidden">

      {/* title part */}
      <div className="bg-primaryDark rounded-2xl px-8 md:px-12 h-36 shadow-[0px_4px_4px_rgba(0,0,0,1)]">
        <p className="text-pureWhite sm:text-4xl pt-8 font-semibold md:text-5xl">
          Welcome to ScrumX
        </p>
        <p className="text-pureWhite px-1 py-2">
          Where teams click & create magic!
        </p>
      </div>
      {/* "Group project" */}
      <Section
        title="Group Projects"
        projects={projectlist.filter((project) => project.category === "group")}
        openModal={() => {
          setIsIndividual(false);
          setIsModalOpen(true);
        }}
      />

      {/* Individual project */}
      <Section
        title="Individual Projects"
        projects={projectlist.filter(
          (project) => project.category === "individual"
        )}
        openModal={() => {
          setIsIndividual(true);
          setIsModalOpen(true);
        }}
      />

      {/* project modal */}
  <AddProject
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIndividual={isIndividual}
      />
    </div>
  );
};

// card 
interface SectionProps {
  title: string;
  projects: Project[];
  openModal: () => void;
}

// first part project 
const Section: React.FC<SectionProps> = ({ title, projects, openModal }) => {
  return (
    <>
      <p className="text-lg font-poppins text-primaryDark font-semibold mt-10">
        {title}
      </p>
      <div className="flex bg-offWhite space-x-5 mt-5 pb-4 overflow-x-auto scrollbar-hidden">

        {/* Create new projecct */}
      <div className="flex-none w-[204px] h-[313px] rounded-xl py-6 px-3 bg-pureWhite shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer"
          onClick={openModal}
        >
          <div className="flex justify-between">
            <p className="text-md text-primaryDark font-poppins font-bold">
              Create Project
            </p>
            <div className="flex h-6 w-6 bg-primaryDark rounded-full justify-center items-center shadow-[0px_4px_4px_rgba(0,0,0,1)]">
              <FaPlus className="text-pureWhite" />
            </div>
          </div>
          <div className="my-4">
            <Image
              src="/CreateProject.png"
              alt="Create a new project"
              width={204}
              height={150}
              className="rounded-md"
            />
          </div>
          <p className="text-sm font-poppins text-primaryDark font-bold text-center">
            Bring Your Ideas to Life!
          </p>
        </div >

         {/* project map */}
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </>
  );
};

interface ProjectCardProps {
  project: Project;
}

// project card
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
   <div className="flex-none w-[204px] h-[313px] rounded-xl py-6 px-3 bg-pureWhite shadow-[0px_4px_4px_rgba(0,0,0,0.25)] group"   >
      <div className="flex justify-between">
        <p className="text-md text-primaryDark font-poppins font-bold">
          {project.projectName}
        </p>
        <div className="flex h-6 w-6">
          <IoIosArrowForward className="text-primaryDark" />
        </div>
      </div>
      <p className="text-sm font-poppins text-gray-700 mt-2 line-clamp-2 group-hover:hidden">
        {project.project_description.length > 80
          ? `${project.project_description.substring(0, 80)}...`
          : project.project_description}
      </p>
      <div className="relative my-4 h-[150px] w-full">
        <Image
          src={project.project_image}
          alt={project.projectName}
          width={204}
          height={150}
          className="rounded-md transition-opacity duration-300 group-hover:opacity-0"
        />
        <p className="absolute inset-0 p-2 font-poppins text-gray-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-justify">
          {project.project_description.length > 210
            ? `${project.project_description.substring(0, 210)}...`
            : project.project_description}
        </p>
      </div>
    </div>
  );
};

export default Page;