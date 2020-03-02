import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties from "./Properties";

type Props = {
  id: string;
  data: EntityData;
};

const Property = ({ id, data }: Props) => {
  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Property" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} noSingleType />
    </div>
  );
};

export default Property;