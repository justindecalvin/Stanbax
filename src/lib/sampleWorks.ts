import { WorkItem } from '../types/work';

export const INITIAL_SAMPLE_WORKS: WorkItem[] = [
  {
    id: 'sample-1',
    title: 'Kinetic Brand Identity & System',
    description: 'Comprehensive visual identity system designed for a spatial robotics studio, featuring dynamic typography, generative layout grid, and tactile print stationery.',
    category: 'Design & Art',
    tags: ['Brand Identity', 'Typography', 'Visual Design', 'Art Direction'],
    fileType: 'image/svg+xml',
    fileName: 'kinetic_identity_system.svg',
    fileSize: 1845000,
    fileDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%2318181B"/>
          <stop offset="100%" stop-color="%2309090B"/>
        </linearGradient>
        <linearGradient id="acc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="%23F43F5E"/>
          <stop offset="100%" stop-color="%23FB923C"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(%23bg)"/>
      <circle cx="400" cy="300" r="160" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none"/>
      <circle cx="400" cy="300" r="100" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" stroke-dasharray="8 6" fill="none"/>
      <circle cx="400" cy="300" r="40" fill="url(%23acc)"/>
      <text x="60" y="90" fill="%23FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="28" letter-spacing="-0.5">KINETIC IDENTITY SYSTEM</text>
      <text x="60" y="125" fill="%23A1A1AA" font-family="system-ui, sans-serif" font-weight="400" font-size="14">VERSION 2.4 · SPATIAL & ROBOTICS LAB</text>
      <rect x="60" y="500" width="180" height="40" rx="6" fill="rgba(255,255,255,0.06)"/>
      <text x="75" y="525" fill="%23E4E4E7" font-family="monospace" font-size="12">SCALE: 1:1.618 RATIO</text>
    </svg>`,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    clientOrContext: 'Robotics Studio',
    externalUrl: 'https://github.com',
    aspectRatio: '4:3',
    dimensions: { width: 800, height: 600 },
    isSample: true,
    aiAnalysis: {
      summary: 'High-contrast minimalist branding with strong mathematical visual hierarchy.',
      strengths: [
        'Precise geometric balance between orbital vector guides and vivid focal point',
        'Cohesive typography scale with tight letter spacing for high-tech aesthetic',
        'Exceptional versatility for digital UI and physical architectural signage'
      ],
      suggestedImprovements: [
        'Provide a light-canvas inversion test for white paper print collateral',
        'Add color specification codes (Pantone / Hex) directly in the presentation sheet'
      ],
      presentationTips: [
        'Highlight the rationale for the 1:1.618 golden ratio spacing in client pitches'
      ],
      analyzedAt: new Date().toISOString()
    }
  },
  {
    id: 'sample-2',
    title: 'High-Throughput Distributed State Engine',
    description: 'Rust and TypeScript implementation of a lock-free distributed log replication protocol with raft consensus and sub-millisecond tail latency.',
    category: 'Code & Engineering',
    tags: ['Rust', 'Distributed Systems', 'TypeScript', 'Performance'],
    fileType: 'text/plain',
    fileName: 'raft_engine_state.rs',
    fileSize: 42800,
    fileContentText: `//! Distributed Raft Consensus Engine
//! Implementation of lock-free event stream replication with zero-copy buffer.

use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Duration, Instant};

#[derive(Debug, Clone)]
pub struct LogEntry {
    pub index: u64,
    pub term: u64,
    pub payload: Vec<u8>,
    pub timestamp_epoch_ms: u64,
}

pub struct StateMachineNode {
    pub node_id: String,
    current_term: AtomicU64,
    commit_index: AtomicU64,
    last_applied: AtomicU64,
}

impl StateMachineNode {
    pub fn new(node_id: String) -> Self {
        Self {
            node_id,
            current_term: AtomicU64::new(0),
            commit_index: AtomicU64::new(0),
            last_applied: AtomicU64::new(0),
        }
    }

    pub fn append_entry(&self, data: &[u8]) -> Result<u64, &'static str> {
        let term = self.current_term.load(Ordering::SeqCst);
        let next_idx = self.commit_index.fetch_add(1, Ordering::SeqCst) + 1;
        // Broadcast commit to quorum cluster
        Ok(next_idx)
    }
}`,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    clientOrContext: 'Core Infrastructure Research',
    externalUrl: 'https://github.com',
    isSample: true,
    aiAnalysis: {
      summary: 'Clean, idiomatic concurrent systems architecture using atomic memory ordering semantics.',
      strengths: [
        'Thread-safe atomic counters (SeqCst) eliminate lock contention',
        'Minimalist idiomatic Rust structure with clear documentation comments'
      ],
      suggestedImprovements: [
        'Document potential overflow handling or term lease bounds for partitioned nodes'
      ],
      presentationTips: [
        'Include benchmark graph showing throughput vs cluster size in the portfolio view'
      ],
      analyzedAt: new Date().toISOString()
    }
  },
  {
    id: 'sample-3',
    title: 'Autonomous Urban Logistics: Policy & Spatial Optimization',
    description: 'A 24-page academic research paper analyzing micro-mobility curb allocation, autonomous delivery zones, and noise mitigation in dense metropolitan corridors.',
    category: 'Writing & Research',
    tags: ['Urban Planning', 'Research Paper', 'Policy Analysis', 'Logistics'],
    fileType: 'application/pdf',
    fileName: 'autonomous_urban_logistics_2026.pdf',
    fileSize: 4210000,
    fileContentText: `AUTONOMOUS URBAN LOGISTICS: SPATIAL ALLOCATION & CURB OPTIMIZATION
Working Paper Series · Department of Civil & Spatial Engineering

Abstract:
Dense urban centers face acute curb competition exacerbated by instantaneous e-commerce fulfillment and autonomous dispatch pods. This study models dynamic dynamic curb space reservation under non-stationary arrival regimes across 14 municipal districts. We propose an auction-based spatial reservation framework yielding a 34.2% reduction in delivery double-parking and an 18% improvement in public transit corridor transit velocity.

Key findings:
1. Dynamic time-slotted curb geofencing reduces traffic queue delay by 22.4 minutes per corridor kilometer.
2. Acoustic mitigation zones during nocturnal off-peak hours yield 92% community acceptance.
3. Multi-modal micro-hubs reduce last-mile heavy diesel vehicle miles by 41.7%.`,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    clientOrContext: 'Urban Policy Research Institute',
    externalUrl: 'https://doi.org',
    isSample: true
  }
];
