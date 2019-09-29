import React, { useState } from "react";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import { TabBar, Tab } from "@rmwc/tabs";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import QueryEditor from "./QueryEditor";
import JSONCodeViewer from "./JSONCodeViewer";
import QueryHistory from "./QueryHistory";
import { Query, runQuery } from "./queries";

const ACTIVE_QUERY_INITIAL_STATE: number | null = null;
const QUERIES_INITIAL_STATE: Query[] = [];

type Props = {
  serverURL: string;
  lastQuery: string | null;
  onLastQueryChange: (query: string) => void;
};

function QueryPage({ serverURL, lastQuery, onLastQueryChange }: Props) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [activeQuery, setActiveQuery] = useState(ACTIVE_QUERY_INITIAL_STATE);
  const [queries, setQueries] = useState(QUERIES_INITIAL_STATE);

  const handleRun = React.useCallback(
    (query, language) => {
      const id = queries.length;
      setActiveQuery(id);
      setQueries(queries => [
        ...queries,
        { id, text: query, result: null, language, time: new Date() }
      ]);
      runQuery(serverURL, language, query)
        .then(result => {
          setQueries(queries =>
            queries.map(query => {
              if (query.id === id) {
                return { ...query, result };
              } else {
                return query;
              }
            })
          );
        })
        .catch(error => {
          alert(error);
        });
    },
    [queries, serverURL]
  );

  const currentQuery = queries.find(query => query.id === activeQuery);
  const result = currentQuery ? currentQuery.result : null;

  return (
    <main>
      <QueryEditor
        onRun={handleRun}
        lastQuery={lastQuery}
        onLastQueryChange={onLastQueryChange}
      />
      <Card>
        <TabBar
          style={{ width: "30em" }}
          activeTabIndex={activeTabIndex}
          onActivate={evt => setActiveTabIndex(evt.detail.index)}
        >
          <Tab>Results</Tab>
          <Tab>Query History</Tab>
        </TabBar>
        {activeTabIndex === 0 && <JSONCodeViewer value={result} />}
        {activeTabIndex === 1 && <QueryHistory queries={queries} />}
      </Card>
    </main>
  );
}

export default QueryPage;
