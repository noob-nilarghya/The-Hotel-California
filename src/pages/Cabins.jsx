import { useState } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { getCabins } from "../services/apiCabins";
import CabinTable from "../features/cabins/CabinTable";
import Button from "../ui/Button";
import CreateCabinForm from "../features/cabins/CreateCabinForm";
import CabinFilter from "../features/cabins/CabinFilter";

function Cabins() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <CabinFilter></CabinFilter>
      </Row>

      <Row type="vertical">
        <CabinTable></CabinTable>

        <Button onClick={()=>setShowForm((show)=> !show)}> {(showForm) ? "Close Form" : "Add new cabin"}</Button>
        {showForm && <CreateCabinForm setShowForm={setShowForm}></CreateCabinForm>}
      </Row>
    </>
  );
}

export default Cabins;
