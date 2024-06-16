import * as React from 'react';
import { Button, Box, Drawer, DialogTitle, ModalClose } from '@mui/joy';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

export default function DrawerCloseButton() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mode, setMode] = React.useState('javascript');
  
  return (
    <React.Fragment>
      <Button variant="outlined" color="neutral" onClick={() => setDrawerOpen(true)}>
        Open drawer
      </Button>
      <Drawer size="lg" anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ModalClose />
        <DialogTitle>My Drawer Note</DialogTitle>
        <AceEditor
          mode={mode}
          theme="monokai"
          fontSize={14}
          lineHeight={19}
          showGutter={true}
          highlightActiveLine={true}
          name="UNIQUE_ID_OF_DIV"
          setOptions={{ useWorker: false }}
          editorProps={{ $blockScrolling: true }}
          width="100%"
        />
        <Box>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
            <option value="python">Python</option>
            <option value="xml">XML</option>
            <option value="ruby">Ruby</option>
        </select>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}