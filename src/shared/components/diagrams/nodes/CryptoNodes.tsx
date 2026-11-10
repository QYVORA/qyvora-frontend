/**
 * CRYPTOGRAPHY NODES
 * ==================
 * 
 * Nodes for cryptographic processes: encryption, keys, certificates, hashing.
 */

import type { BaseNodeType } from "./BaseNode";
import React, { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import {
  FileText,
  FileLock,
  Key,
  FileCheck2,
  Shield,
  Hash,
  FileSignature,
  Lock,
  Unlock,
} from 'lucide-react';
import { BaseNode, type BaseNodeData } from './BaseNode';

/**
 * Plaintext Node
 */
export const PlaintextNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<FileText size={28} strokeWidth={2.5} />} />;
});
PlaintextNode.displayName = 'PlaintextNode';

/**
 * Ciphertext Node
 */
export const CiphertextNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<FileLock size={28} strokeWidth={2.5} />} />;
});
CiphertextNode.displayName = 'CiphertextNode';

/**
 * Encryption Process Node
 */
export const EncryptionNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Lock size={28} strokeWidth={2.5} />} />;
});
EncryptionNode.displayName = 'EncryptionNode';

/**
 * Decryption Process Node
 */
export const DecryptionNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Unlock size={28} strokeWidth={2.5} />} />;
});
DecryptionNode.displayName = 'DecryptionNode';

/**
 * Key Node (cryptographic key)
 */
export const KeyNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Key size={28} strokeWidth={2.5} />} />;
});
KeyNode.displayName = 'KeyNode';

/**
 * Certificate Node
 */
export const CertificateNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<FileCheck2 size={28} strokeWidth={2.5} />} />;
});
CertificateNode.displayName = 'CertificateNode';

/**
 * Certificate Authority Node
 */
export const CertificateAuthorityNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Shield size={28} strokeWidth={2.5} />} />;
});
CertificateAuthorityNode.displayName = 'CertificateAuthorityNode';

/**
 * Hash Function Node
 */
export const HashNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Hash size={28} strokeWidth={2.5} />} />;
});
HashNode.displayName = 'HashNode';

/**
 * Signature Node (digital signature)
 */
export const SignatureNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<FileSignature size={28} strokeWidth={2.5} />} />;
});
SignatureNode.displayName = 'SignatureNode';
