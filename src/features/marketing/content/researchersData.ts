/**
 * researchersData.ts
 *
 * Registry for QYVORA's technical team (QuiteRoot). All former members have been
 * removed — the team currently has zero active members and is open to applications.
 * Removed data is archived in /home/wsuits6/WORK/QYVORA/archive/quiet-roots-removed-data.json
 * (outside this repository) and must not be re-imported here.
 */

export interface Researcher {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  width: number;
  height: number;
}

export const researchersData: Researcher[] = [];

export default researchersData;
