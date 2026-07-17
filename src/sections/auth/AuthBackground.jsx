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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',      
    filter: 'blur(30px)',
    zIndex: -1,
  }}
>
  <img
    src={logoIconImage}
    width="30%"
    height="30%"
    viewBox="0 0 405 809"
    fill="none"
  />
</Box>
  );
}
