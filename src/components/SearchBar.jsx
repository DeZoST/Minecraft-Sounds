import PropTypes from "prop-types";
import { Input } from "@chakra-ui/react";

function SearchBar({ setSearchTerm }) {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Input
      placeholder="Rechercher par nom ou tag..."
      onChange={handleChange}
      my={4}
    />
  );
}

SearchBar.propTypes = {
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchBar;
