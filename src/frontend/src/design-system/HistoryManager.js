/**
 * Design System History Manager
 * Chronological management and versioning system for GUI collections
 */

import { format } from 'date-fns';
import { createHash } from 'crypto';

export class HistoryManager {
  constructor() {
    this.historyLog = new Map();
    this.changesets = new Map();
    this.snapshots = new Map();
    this.branches = new Map(); // For future design system feature branches
  }

  /**
   * Register a configuration as Active/Default
   * @param {string} collectionId - Collection ID
   * @param {object} configData - Configuration data
   */
  registerActiveDefault(collectionId, configData) {
    const entry = {
      id: this.generateId(),
      collectionId,
      timestamp: new Date(),
      type: 'ACTIVE_DEFAULT_SET',
      status: 'active|default',
      description: 'Configuration set as Active and Default',
      changes: {
        from: 'previous_config',
        to: 'modern_enterprise_active',
        impact: 'HIGH'
      },
      metadata: {
        version: configData.version || '2.0.0',
        author: 'System',
        environment: 'production',
        backup: configData.backup || null
      },
      features: configData.features || [],
      hash: this.generateHash(JSON.stringify(configData))
    };

    this.addToHistory(collectionId, entry);
    this.createSnapshot(collectionId, `active-default-${format(new Date(), 'yyyyMMdd-HHmmss')}`, configData);
    
    return entry;
  }

  /**
   * Initialize history tracking for a collection
   * @param {string} collectionId - Collection ID
   * @param {object} initialData - Initial collection data
   */
  initializeHistory(collectionId, initialData) {
    const historyEntry = {
      collectionId,
      createdAt: new Date(),
      entries: [],
      branches: ['main'], // Main branch
      currentBranch: 'main',
      tags: [],
      metadata: {
        totalChanges: 0,
        lastMajorUpdate: new Date(),
        lastMinorUpdate: new Date(),
        lastPatchUpdate: new Date()
      }
    };

    // Create the first history entry
    const initialEntry = this.createHistoryEntry(
      collectionId,
      'collection.created',
      'Initial collection creation',
      null,
      initialData,
      '1.0.0'
    );

    historyEntry.entries.push(initialEntry);
    this.historyLog.set(collectionId, historyEntry);

    // Create the first snapshot
    this.createSnapshot(collectionId, initialData, 'Initial baseline snapshot');

    return historyEntry;
  }

  /**
   * Record a change in the collection
   * @param {string} collectionId - Collection ID
   * @param {string} changeType - Type of change
   * @param {string} description - Description of the change
   * @param {object} oldValue - Previous value
   * @param {object} newValue - New value
   * @param {string} version - Version after the change
   * @param {object} metadata - Additional metadata
   */
  recordChange(collectionId, changeType, description, oldValue, newValue, version, metadata = {}) {
    const history = this.historyLog.get(collectionId);
    if (!history) {
      throw new Error(`History not initialized for collection ${collectionId}`);
    }

    // Create history entry
    const entry = this.createHistoryEntry(
      collectionId,
      changeType,
      description,
      oldValue,
      newValue,
      version,
      metadata
    );

    history.entries.push(entry);
    history.metadata.totalChanges++;

    // Update timestamp based on version type
    this.updateVersionTimestamps(history, version);

    // Create changeset if requested
    if (metadata.createChangeset) {
      this.createChangeset(collectionId, entry, metadata.changesetName);
    }

    // Auto-snapshot for major changes
    if (this.isMajorChange(changeType)) {
      this.createSnapshot(collectionId, newValue, `Auto-snapshot: ${description}`);
    }

    this.historyLog.set(collectionId, history);
    return entry;
  }

  /**
   * Create a history entry
   */
  createHistoryEntry(collectionId, changeType, description, oldValue, newValue, version, metadata = {}) {
    const entryId = this.generateEntryId();
    const timestamp = new Date();

    return {
      id: entryId,
      collectionId,
      timestamp,
      changeType,
      description,
      version,
      oldValue: oldValue ? this.sanitizeValue(oldValue) : null,
      newValue: newValue ? this.sanitizeValue(newValue) : null,
      diff: this.calculateDiff(oldValue, newValue),
      hash: this.calculateHash(newValue),
      author: metadata.author || 'system',
      branch: metadata.branch || 'main',
      tags: metadata.tags || [],
      metadata: {
        ...metadata,
        changeSize: this.calculateChangeSize(oldValue, newValue),
        impactLevel: this.calculateImpactLevel(changeType),
        automated: metadata.automated || false
      }
    };
  }

  /**
   * Create a complete collection snapshot
   * @param {string} collectionId - Collection ID
   * @param {object} data - Complete collection data
   * @param {string} description - Snapshot description
   * @param {object} metadata - Additional metadata
   */
  createSnapshot(collectionId, data, description, metadata = {}) {
    const snapshotId = this.generateSnapshotId();
    const timestamp = new Date();

    const snapshot = {
      id: snapshotId,
      collectionId,
      timestamp,
      description,
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      hash: this.calculateHash(data),
      size: JSON.stringify(data).length,
      metadata: {
        ...metadata,
        version: data.version || 'unknown',
        branch: metadata.branch || 'main',
        automatic: metadata.automatic || false
      }
    };

    // Keep only the last 50 snapshots per collection
    const existing = Array.from(this.snapshots.values())
      .filter(s => s.collectionId === collectionId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (existing.length >= 50) {
      // Remove the oldest ones
      existing.slice(49).forEach(old => {
        this.snapshots.delete(old.id);
      });
    }

    this.snapshots.set(snapshotId, snapshot);
    return snapshot;
  }

  /**
   * Create a changeset to group related modifications
   * @param {string} collectionId - Collection ID
   * @param {object} entry - History entry
   * @param {string} changesetName - Changeset name
   */
  createChangeset(collectionId, entry, changesetName) {
    const changesetId = this.generateChangesetId();
    const timestamp = new Date();

    let changeset = Array.from(this.changesets.values())
      .find(cs => cs.collectionId === collectionId && cs.name === changesetName && cs.status === 'open');

    if (!changeset) {
      changeset = {
        id: changesetId,
        collectionId,
        name: changesetName,
        status: 'open', // open, closed, merged
        createdAt: timestamp,
        updatedAt: timestamp,
        entries: [],
        metadata: {
          author: entry.author,
          branch: entry.branch,
          totalChanges: 0
        }
      };
      this.changesets.set(changesetId, changeset);
    }

    changeset.entries.push(entry.id);
    changeset.updatedAt = timestamp;
    changeset.metadata.totalChanges++;

    return changeset;
  }

  /**
   * Get the complete history of a collection
   * @param {string} collectionId - Collection ID
   * @param {object} options - Filter options
   */
  getHistory(collectionId, options = {}) {
    const history = this.historyLog.get(collectionId);
    if (!history) return null;

    let entries = [...history.entries];

    // Filters
    if (options.since) {
      entries = entries.filter(e => new Date(e.timestamp) >= new Date(options.since));
    }

    if (options.until) {
      entries = entries.filter(e => new Date(e.timestamp) <= new Date(options.until));
    }

    if (options.changeType) {
      entries = entries.filter(e => e.changeType === options.changeType);
    }

    if (options.author) {
      entries = entries.filter(e => e.author === options.author);
    }

    if (options.branch) {
      entries = entries.filter(e => e.branch === options.branch);
    }

    // Sorting
    entries.sort((a, b) => {
      if (options.order === 'asc') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Limit
    if (options.limit) {
      entries = entries.slice(0, options.limit);
    }

    return {
      ...history,
      entries,
      filtered: entries.length !== history.entries.length
    };
  }

  /**
   * Get all snapshots of a collection
   * @param {string} collectionId - Collection ID
   */
  getSnapshots(collectionId) {
    return Array.from(this.snapshots.values())
      .filter(s => s.collectionId === collectionId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Restore a collection from a snapshot
   * @param {string} collectionId - Collection ID
   * @param {string} snapshotId - Snapshot ID
   */
  restoreFromSnapshot(collectionId, snapshotId) {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot || snapshot.collectionId !== collectionId) {
      throw new Error(`Snapshot ${snapshotId} not found for collection ${collectionId}`);
    }

    // Register the restore as a change
    this.recordChange(
      collectionId,
      'collection.restored',
      `Restored from snapshot: ${snapshot.description}`,
      null,
      snapshot.data,
      snapshot.metadata.version,
      {
        snapshotId,
        restoredAt: new Date(),
        automated: false
      }
    );

    return snapshot.data;
  }

  /**
   * Compare two versions of a collection
   * @param {string} collectionId - Collection ID
   * @param {string} version1 - First version
   * @param {string} version2 - Second version
   */
  compareVersions(collectionId, version1, version2) {
    const history = this.historyLog.get(collectionId);
    if (!history) throw new Error(`History not found for ${collectionId}`);

    const entry1 = history.entries.find(e => e.version === version1);
    const entry2 = history.entries.find(e => e.version === version2);

    if (!entry1 || !entry2) {
      throw new Error('One or both versions were not found');
    }

    return {
      version1: {
        version: entry1.version,
        timestamp: entry1.timestamp,
        data: entry1.newValue
      },
      version2: {
        version: entry2.version,
        timestamp: entry2.timestamp,
        data: entry2.newValue
      },
      diff: this.calculateDiff(entry1.newValue, entry2.newValue),
      changesSummary: this.summarizeChanges(entry1, entry2)
    };
  }

  /**
   * Generate history report
   * @param {string} collectionId - Collection ID
   * @param {object} options - Report options
   */
  generateHistoryReport(collectionId, options = {}) {
    const history = this.getHistory(collectionId, options);
    if (!history) throw new Error(`History not found for ${collectionId}`);

    const report = {
      collectionId,
      reportGeneratedAt: new Date(),
      period: {
        from: options.since || history.entries[history.entries.length - 1]?.timestamp,
        to: options.until || history.entries[0]?.timestamp
      },
      summary: {
        totalChanges: history.entries.length,
        changeTypes: this.groupByChangeType(history.entries),
        authors: this.groupByAuthor(history.entries),
        impactLevels: this.groupByImpactLevel(history.entries),
        versionsInPeriod: this.getVersionsInPeriod(history.entries)
      },
      timeline: this.createTimeline(history.entries),
      snapshots: this.getSnapshots(collectionId).length,
      changesets: Array.from(this.changesets.values())
        .filter(cs => cs.collectionId === collectionId).length,
      metadata: history.metadata
    };

    return report;
  }

  /**
   * Export history in JSON format
   * @param {string} collectionId - Collection ID
   * @param {string} format - Export format
   */
  exportHistory(collectionId, format = 'json') {
    const history = this.getHistory(collectionId);
    const snapshots = this.getSnapshots(collectionId);
    const changesets = Array.from(this.changesets.values())
      .filter(cs => cs.collectionId === collectionId);

    const exportData = {
      collectionId,
      exportedAt: new Date(),
      format: `history-export-v1.0-${format}`,
      history,
      snapshots,
      changesets,
      metadata: {
        totalEntries: history.entries.length,
        totalSnapshots: snapshots.length,
        totalChangesets: changesets.length,
        dateRange: {
          from: history.entries[history.entries.length - 1]?.timestamp,
          to: history.entries[0]?.timestamp
        }
      }
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }

    // Future: other formats (CSV, XML, etc.)
    throw new Error(`Format ${format} not supported`);
  }

  /**
   * Utility methods
   */
  sanitizeValue(value) {
    if (typeof value === 'object' && value !== null) {
      // Remove sensitive or too large data
      const sanitized = JSON.parse(JSON.stringify(value));
      return sanitized;
    }
    return value;
  }

  calculateHash(data) {
    return createHash('md5').update(JSON.stringify(data)).digest('hex');
  }

  calculateDiff(oldValue, newValue) {
    // Simplified diff implementation
    if (!oldValue && newValue) return { type: 'added', changes: newValue };
    if (oldValue && !newValue) return { type: 'removed', changes: oldValue };
    if (!oldValue && !newValue) return { type: 'none', changes: null };

    // For now a simple diff, in the future a dedicated library could be used
    return {
      type: 'modified',
      changes: {
        before: this.sanitizeValue(oldValue),
        after: this.sanitizeValue(newValue)
      }
    };
  }

  calculateChangeSize(oldValue, newValue) {
    const oldSize = oldValue ? JSON.stringify(oldValue).length : 0;
    const newSize = newValue ? JSON.stringify(newValue).length : 0;
    return Math.abs(newSize - oldSize);
  }

  calculateImpactLevel(changeType) {
    const impactMap = {
      'collection.created': 'high',
      'collection.restored': 'high',
      'theme.changed': 'high',
      'colors.updated': 'medium',
      'components.added': 'medium',
      'components.modified': 'low',
      'icons.added': 'low',
      'animations.added': 'low',
      'typography.updated': 'medium',
      'accessibility.improved': 'medium',
      'performance.optimized': 'low',
      'technical.updated': 'low'
    };

    return impactMap[changeType] || 'unknown';
  }

  isMajorChange(changeType) {
    const majorChanges = [
      'collection.created',
      'collection.restored', 
      'theme.changed',
      'colors.major_update',
      'components.breaking_change',
      'architecture.changed'
    ];
    return majorChanges.includes(changeType);
  }

  updateVersionTimestamps(history, version) {
    const [major, minor, patch] = version.split('.').map(Number);
    const now = new Date();

    // Check the last version to determine the update type
    const lastEntry = history.entries[history.entries.length - 2]; // Second to last entry
    if (lastEntry) {
      const [lastMajor, lastMinor, lastPatch] = lastEntry.version.split('.').map(Number);
      
      if (major > lastMajor) {
        history.metadata.lastMajorUpdate = now;
      } else if (minor > lastMinor) {
        history.metadata.lastMinorUpdate = now;
      } else if (patch > lastPatch) {
        history.metadata.lastPatchUpdate = now;
      }
    }
  }

  groupByChangeType(entries) {
    return entries.reduce((acc, entry) => {
      acc[entry.changeType] = (acc[entry.changeType] || 0) + 1;
      return acc;
    }, {});
  }

  groupByAuthor(entries) {
    return entries.reduce((acc, entry) => {
      acc[entry.author] = (acc[entry.author] || 0) + 1;
      return acc;
    }, {});
  }

  groupByImpactLevel(entries) {
    return entries.reduce((acc, entry) => {
      const level = entry.metadata.impactLevel;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
  }

  getVersionsInPeriod(entries) {
    return [...new Set(entries.map(e => e.version))];
  }

  createTimeline(entries) {
    return entries.map(entry => ({
      timestamp: entry.timestamp,
      version: entry.version,
      changeType: entry.changeType,
      description: entry.description,
      impactLevel: entry.metadata.impactLevel,
      author: entry.author
    }));
  }

  generateEntryId() {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateSnapshotId() {
    return `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateChangesetId() {
    return `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  summarizeChanges(entry1, entry2) {
    // Simplified summary implementation
    return {
      timespan: Math.abs(new Date(entry2.timestamp) - new Date(entry1.timestamp)),
      versionJump: entry2.version !== entry1.version,
      changeTypes: [entry1.changeType, entry2.changeType],
      impact: [entry1.metadata.impactLevel, entry2.metadata.impactLevel]
    };
  }
}

export default HistoryManager;