/**
 * Available tabs in the profile screen
 */
export type ProfileTab = 'yarns' | 'patterns' | 'projects';

/**
 * User data needed by profile components
 */
export interface ProfileUser {
  fullName: string;
  email: string;
}

/**
 * Stats displayed in the profile header
 */
export interface ProfileStats {
  yarns: number;
  patterns: number;
  projects: number;
}
