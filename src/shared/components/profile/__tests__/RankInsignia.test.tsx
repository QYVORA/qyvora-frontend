import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  RankInsignia,
  normalizeRank,
  RANK_TIERS,
  CandidateInsignia,
  ContributorInsignia,
  SpecialistInsignia,
  ArchitectInsignia,
  VanguardInsignia,
} from '../RankInsignia';

describe('RankInsignia', () => {
  it('normalizes string ranks accurately', () => {
    expect(normalizeRank('Candidate')).toBe('Candidate');
    expect(normalizeRank('candidate')).toBe('Candidate');
    expect(normalizeRank('Contributor')).toBe('Contributor');
    expect(normalizeRank('Specialist')).toBe('Specialist');
    expect(normalizeRank('Architect')).toBe('Architect');
    expect(normalizeRank('Vanguard')).toBe('Vanguard');
    expect(normalizeRank('vanguard elite')).toBe('Vanguard');
    // Fallback for unknown rank
    expect(normalizeRank('Novice Unknown')).toBe('Candidate');
    expect(normalizeRank(undefined)).toBe('Candidate');
  });

  it('renders all canonical rank insignias without throwing', () => {
    const { container: c1 } = render(<CandidateInsignia />);
    expect(c1.querySelector('svg')).toBeInTheDocument();

    const { container: c2 } = render(<ContributorInsignia />);
    expect(c2.querySelector('svg')).toBeInTheDocument();

    const { container: c3 } = render(<SpecialistInsignia />);
    expect(c3.querySelector('svg')).toBeInTheDocument();

    const { container: c4 } = render(<ArchitectInsignia />);
    expect(c4.querySelector('svg')).toBeInTheDocument();

    const { container: c5 } = render(<VanguardInsignia />);
    expect(c5.querySelector('svg')).toBeInTheDocument();
  });

  it('renders RankInsignia component with showLabel', () => {
    render(<RankInsignia rank="Specialist" showLabel />);
    expect(screen.getByText('Specialist')).toBeInTheDocument();
  });

  it('provides authoritative metadata for each rank tier', () => {
    expect(RANK_TIERS.Candidate.minPoints).toBe(0);
    expect(RANK_TIERS.Contributor.minPoints).toBe(3000);
    expect(RANK_TIERS.Specialist.minPoints).toBe(5000);
    expect(RANK_TIERS.Architect.minPoints).toBe(9000);
    expect(RANK_TIERS.Vanguard.minPoints).toBe(17000);
  });
});
