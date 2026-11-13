/**
 * LEARNING DIAGRAM LIBRARY
 * ========================
 *
 * Curated, reusable diagram definitions referenced by lessons through a
 * `diagram` fence:
 *
 *   ```diagram
 *   id: osi-model
 *   title: The OSI Model
 *   caption: Data flows down on send and back up on receive.
 *   ```
 *
 * Keeping definitions here (rather than inline in lesson copy) means one
 * reviewed, accessible diagram is reused everywhere it is relevant.
 */

import type { DiagramDefinition } from '@/shared/components/diagrams/types';
import { osiModelDiagram } from './defs/osiModel';
import { tcpThreeWayHandshakeDiagram } from './defs/tcpThreeWayHandshake';
import { httpRequestResponseDiagram } from './defs/httpRequestResponse';
import { dnsResolutionDiagram } from './defs/dnsResolution';
import { encapsulationDiagram } from './defs/encapsulation';
import { networkTopologyBasicDiagram } from './defs/networkTopologyBasic';
import { nmapScanTypesDiagram } from './defs/nmapScanTypes';
import { tlsHandshakeDiagram } from './defs/tlsHandshake';
import { sqlInjectionFlowDiagram } from './defs/sqlInjectionFlow';
import { wifi4WayHandshakeDiagram } from './defs/wifi4WayHandshake';
import { proxyInterceptDiagram } from './defs/proxyIntercept';
import { webReconFlowDiagram } from './defs/webReconFlow';
import { arpSpoofingDiagram } from './defs/arpSpoofing';
import { linuxPermissionsDiagram } from './defs/linuxPermissions';

export const DIAGRAM_LIBRARY: Record<string, DiagramDefinition> = {
  'osi-model': osiModelDiagram,
  'tcp-three-way-handshake': tcpThreeWayHandshakeDiagram,
  'http-request-response': httpRequestResponseDiagram,
  'dns-resolution': dnsResolutionDiagram,
  encapsulation: encapsulationDiagram,
  'network-topology-basic': networkTopologyBasicDiagram,
  'nmap-scan-types': nmapScanTypesDiagram,
  'tls-handshake': tlsHandshakeDiagram,
  'sql-injection-flow': sqlInjectionFlowDiagram,
  'wifi-4way-handshake': wifi4WayHandshakeDiagram,
  'proxy-intercept': proxyInterceptDiagram,
  'web-recon-flow': webReconFlowDiagram,
  'arp-spoofing': arpSpoofingDiagram,
  'linux-permissions': linuxPermissionsDiagram,
};

export function getLibraryDiagram(id: string): DiagramDefinition | undefined {
  return DIAGRAM_LIBRARY[id];
}
