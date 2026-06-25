// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const NAV_LINKS = [
  { label: 'Hire Us', href: 'https://codedthemes.com/hire-us/' },
  { label: 'License', href: 'https://mui.com/store/license/' },
  { label: 'Terms', href: 'https://mui.com/store/terms/' },
  { label: 'Figma', href: 'https://links.codedthemes.com/dAAOP' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 'auto', position: 'relative', px: 2, pt: 2.5, pb: 2 }}
    >
      {/* Gradient fade separator — fades in from primary color, then out */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: '4%',
          right: '4%',
          height: '1px',
          background: (theme) =>
            `linear-gradient(90deg,
              transparent 0%,
              ${alpha(theme.palette.primary.main, 0.4)} 25%,
              ${theme.palette.primary.main} 50%,
              ${alpha(theme.palette.primary.main, 0.4)} 75%,
              transparent 100%)`,
        }}
      />
 
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}
      >
        {/* Copyright with live pulse dot */}
        <Stack direction="row" alignItems="center" gap={1}>
          {/* Pulsing "live" status indicator */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'relative',
              width: 7,
              height: 7,
              flexShrink: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                bgcolor: 'success.main',
                '@keyframes footerPulse': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
                  '50%': { transform: 'scale(2.5)', opacity: 0 },
                },
                animation: 'footerPulse 2.4s ease-in-out infinite',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: '1px',
                borderRadius: '50%',
                bgcolor: 'success.main',
              },
            }}
          />
 
          <Typography variant="caption" sx={{ color: 'text.secondary', userSelect: 'none' }}>
            &copy; {new Date().getFullYear()}{' '}
            <Link
              href="https://codedthemes.com/"
              target="_blank"
              underline="none"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: '1px',
                  bgcolor: 'primary.main',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'transform 0.25s ease',
                },
                '&:hover::after': { transform: 'scaleX(1)' },
              }}
            >
              CodedThemes
            </Link>
          </Typography>
        </Stack>
 
        {/* Nav links with dot separators */}
        <Stack
          component="nav"
          aria-label="Footer links"
          direction="row"
          alignItems="center"
          sx={{ flexWrap: 'wrap', gap: 0 }}
        >
          {NAV_LINKS.map((link, i) => (
            <Stack key={link.href} direction="row" alignItems="center">
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                underline="none"
                sx={{
                  color: 'text.secondary',
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 500,
                  letterSpacing: '0.2px',
                  display: 'inline-block',
                  transition: 'color 0.2s ease, background-color 0.2s ease, transform 0.15s ease',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateY(-1px)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                }}
              >
                {link.label}
              </Link>
 
              {i < NAV_LINKS.length - 1 && (
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    bgcolor: 'text.disabled',
                    opacity: 0.5,
                    flexShrink: 0,
                  }}
                />
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
