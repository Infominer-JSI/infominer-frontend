// import interfaces
import { ISubsetHeader } from "Interfaces";
// import modules
import React from "react";
import { Story } from "@storybook/react/types-6-0";
import { dataset } from "utils/defaults";
// import the component
import SubsetHeader from "./index";

// ==============================================
// Configure Story
// ==============================================

const storyComponent = {
  component: SubsetHeader,
  title: "Subset/Header",
};

export default storyComponent;

// ==============================================
// Configure Story Versions
// ==============================================

const Template: Story<ISubsetHeader> = (args: ISubsetHeader) => (
  <SubsetHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  selectedId: 0,
  dataset,
};
