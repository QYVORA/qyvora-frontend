import React from 'react';
import Button from './Button';
import { openCookiePreferences } from '@/shared/utils/cookiePreferences';

interface CookiePreferencesButtonProps {
  label?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
  className?: string;
}

const CookiePreferencesButton: React.FC<CookiePreferencesButtonProps> = ({
  label = 'Manage cookie preferences',
  variant = 'secondary',
  size = 'md',
  className,
}) => (
  <Button type="button" variant={variant} size={size} className={className} onClick={openCookiePreferences}>
    {label}
  </Button>
);

export default CookiePreferencesButton;
