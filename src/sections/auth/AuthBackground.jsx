// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import logoIconImage from 'assets/images/logo/image.svg';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit'
      }}
    >
      <img
        src={logoIconImage}
        width="100%"
        height="calc(100vh - 175px)"
        viewBox="0 0 405 809"
        fill="none"
      />
    </Box>
  );
}
