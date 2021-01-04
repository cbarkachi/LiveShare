import React, { useState } from "react";
// import { compose, withProps } from "recompose";
// import { withScriptjs } from "react-google-maps";
// import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { Form } from "react-bootstrap";
import { getQueryMap } from "library/helpers/url_handler";
import { useHistory } from "react-router-dom";
import goToSearchPage from "library/helpers/search";
import { Input } from "antd";
import { connectSearchBox } from "react-instantsearch-dom";

const SearchSkill = (props) => {
  // const [search, setSearch] = useState(props.)
  const history = useHistory();
  const [search, setSearch] = useState(
    getQueryMap(history.location.search).get("skill")
  );
  const { currentRefinement, isSearchStalled, refine } = props;
  function handleSearchChange(event) {
    setSearch(event.target.value || "");
    refine(event.target.value);
  }

  return (
    <>
      <div className="map_autocomplete">
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            goToSearchPage(search, history);
          }}
        >
          <Input
            type="text"
            defaultValue=""
            size="large"
            onChange={handleSearchChange}
            value={search}
          />
        </Form>
      </div>
    </>
  );
};

export default connectSearchBox(SearchSkill);
