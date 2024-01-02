import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({options}) {

    const [searchParams, setSearchParams] = useSearchParams();
    const currSortBy= searchParams.get("sortBy") || "";


    function handleChange(evt){
        searchParams.set("sortBy", evt.target.value);
        setSearchParams(searchParams);
    }

    return (<Select options={options} value={currSortBy} onChange={handleChange} type='white'></Select>);
}

export default SortBy;
