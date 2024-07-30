import PropTypes from "prop-types";
import { Input } from "@chakra-ui/react";
import { memo } from "react";

const SearchBar = memo(({ setSearchTerm }) => {
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
});

SearchBar.propTypes = {
    setSearchTerm: PropTypes.func.isRequired,
};

SearchBar.displayName = "SearchBar";

export default SearchBar;
