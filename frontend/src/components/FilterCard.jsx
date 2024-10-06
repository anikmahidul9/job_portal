import { RadioGroup } from "./ui/radio-group";

const filterData = [
  {
    filterType: "Locations",
    area: ["Dhaka", "New York", "Mosco", "Pune", "Paris"],
  },
  {
    filterType: "Industry",
    area: ["Web Development", "Ai ", "Backend"],
  },
  {
    filterType: "Salary",
    area: ["0-60k", "60-1lakh"," 1-5 laks",],
  },
];
const FilterCard = () => {
  return (
    <div>
      <h1 className="font-bold">Filter Jobs</h1>
      <hr className="mt-3"/>
      <RadioGroup>
        {
          filterData.map((filter, index) => (
            <div key={index}>
              <label className="block text-sm font-bold text-gray-700">
                {filter.filterType}
              </label>
              <div className="mt-2">
                {filter.area.map((area, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={`radio-${index}`}
                      name={`radio-${index}`}
                      value={area}
                    />
                    <label
                      className="ml-3 text-sm font-medium text-gray-900"
                      htmlFor={`radio-${index}`}
                    >
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}

export default FilterCard