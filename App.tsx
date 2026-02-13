import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { ReactFlowProvider } from 'reactflow';
import { useFlowStore } from './store';

import { FlowEditor } from './components/FlowEditor';
import { HomePage } from './components/HomePage';

import { useBrandTheme } from './hooks/useBrandTheme';

const FlowEditorWrapper = ({ onGoHome }: { onGoHome: () => void }) => {
  return <FlowEditor onGoHome={onGoHome} />;
};

const FlowCanvasRoute = () => {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const { setActiveTabId } = useFlowStore();

  useEffect(() => {
    if (flowId) {
      setActiveTabId(flowId);
    }
  }, [flowId, setActiveTabId]);

  return <FlowEditor onGoHome={() => navigate('/')} />;
};

const HomePageRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === '/settings' ? 'settings' : 'home';

  const handleLaunch = () => {
    navigate('/canvas');
  };

  const handleRestore = (snapshot: any) => {
    const { setNodes, setEdges } = useFlowStore.getState();
    // Deep copy to prevent state mutation issues if snapshot is just a ref
    const nodesCopy = JSON.parse(JSON.stringify(snapshot.nodes));
    const edgesCopy = JSON.parse(JSON.stringify(snapshot.edges));
    setNodes(nodesCopy);
    setEdges(edgesCopy);
    navigate('/canvas');
  };

  return (
    <HomePage
      onLaunch={handleLaunch}
      onImportJSON={() => {
        navigate('/canvas');
        setTimeout(() => {
          document.getElementById('json-import-input')?.click();
        }, 100);
      }}
      onRestoreSnapshot={handleRestore}
      activeTab={activeTab}
      onSwitchTab={(tab) => navigate(tab === 'settings' ? '/settings' : '/')}
    />
  );
};

import { DocsLayout } from './components/docs/DocsLayout';
import { DocsPage } from './components/docs/DocsPage';

function App() {
  useBrandTheme();

  return (
    <Router>
      <ReactFlowProvider>
        <Routes>
          <Route path="/" element={<HomePageRoute />} />
          <Route path="/settings" element={<HomePageRoute />} />
          <Route path="/canvas" element={<FlowCanvasRoute />} />
          <Route path="/flow/:flowId" element={<FlowCanvasRoute />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route path=":slug" element={<DocsPage />} />
          </Route>
        </Routes>
      </ReactFlowProvider>
    </Router>
  );
}

export default App;