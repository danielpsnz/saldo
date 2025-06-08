"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

type HeaderBoxProps = {
  type?: string;
  title: string;
  subtext?: string;
  user?: string;
};

const HeaderBox = ({ type = "title", title, subtext }: HeaderBoxProps) => {
  const { user } = useUser();
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === "greeting" && (
          <span className="text-[#7e4a24]">&nbsp;{user?.firstName} 👋🏼</span>
        )}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
};

export default HeaderBox;
