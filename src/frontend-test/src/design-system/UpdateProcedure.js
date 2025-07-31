/**
 * Design System Update Procedure
 * Sistema completo per gestione aggiornamenti, versioning e procedure di mantenimento
 */

import DesignSystemCollector from './DesignSystemCollector.js';
import HistoryManager from './HistoryManager.js';
import { format } from 'date-fns';

export class UpdateProcedure {
  constructor() {
    this.collector = new DesignSystemCollector();
    this.historyManager = new HistoryManager();
    this.updateQueue = [];
    this.scheduledUpdates = new Map();
    this.validators = new Map();
    this.hooks = {
      beforeUpdate: [],
      afterUpdate: [],
      beforeVersion: [],
      afterVersion: []
    };
  }

  /**
   * Inizializza il sistema di aggiornamento per una raccolta
   * @param {string} collectionId - ID della raccolta
   */
  async initializeForCollection(collectionId) {
    const collection = this.collector.getCollection(collectionId);
    if (!collection) {
      throw new Error(`Raccolta ${collectionId} non trovata`);
    }

    // Inizializza cronologia se non esiste
    if (!this.historyManager.historyLog.has(collectionId)) {
      this.historyManager.initializeHistory(collectionId, collection);
    }

    // Registra validators di base
    this.registerValidator('semantic-version', this.validateSemanticVersion.bind(this));
    this.registerValidator('breaking-changes', this.validateBreakingChanges.bind(this));
    this.registerValidator('accessibility', this.validateAccessibility.bind(this));
    this.registerValidator('performance', this.validatePerformance.bind(this));

    return {
      collectionId,
      initialized: true,
      historyEnabled: true,
      validatorsRegistered: Array.from(this.validators.keys()),
      hooksEnabled: Object.keys(this.hooks).filter(k => this.hooks[k].length > 0)
    };
  }

  /**
   * Procedura principale di aggiornamento raccolta
   * @param {string} collectionId - ID della raccolta
   * @param {object} updates - Oggetto con gli aggiornamenti
   * @param {object} options - Opzioni per l'aggiornamento
   */
  async updateCollection(collectionId, updates, options = {}) {
    const startTime = Date.now();
    
    try {
      // 1. Pre-validazione
      await this.preUpdateValidation(collectionId, updates, options);

      // 2. Calcola nuova versione
      const newVersion = await this.calculateNewVersion(collectionId, updates, options);

      // 3. Esegue hooks pre-update
      await this.executeHooks('beforeUpdate', { collectionId, updates, options });

      // 4. Backup automatico pre-update
      const backupId = await this.createPreUpdateBackup(collectionId, newVersion);

      // 5. Applica aggiornamenti
      const result = await this.applyUpdates(collectionId, updates, newVersion, options);

      // 6. Post-update validation
      await this.postUpdateValidation(collectionId, result);

      // 7. Registra cambiamenti nella cronologia
      await this.recordHistoryChanges(collectionId, updates, result, newVersion, options);

      // 8. Esegue hooks post-update
      await this.executeHooks('afterUpdate', { collectionId, result, newVersion });

      // 9. Cleanup e ottimizzazione
      await this.postUpdateCleanup(collectionId);

      const endTime = Date.now();

      return {
        success: true,
        collectionId,
        version: newVersion,
        previousVersion: result.previousVersion,
        changesApplied: Object.keys(updates).length,
        backupId,
        executionTime: endTime - startTime,
        result
      };

    } catch (error) {
      // Rollback in caso di errore
      await this.handleUpdateError(collectionId, updates, error, options);
      throw error;
    }
  }

  /**
   * Aggiornamento incrementale (solo parti specifiche)
   * @param {string} collectionId - ID della raccolta
   * @param {string} section - Sezione da aggiornare
   * @param {object} sectionUpdates - Aggiornamenti per la sezione
   * @param {object} options - Opzioni
   */
  async updateSection(collectionId, section, sectionUpdates, options = {}) {
    const collection = this.collector.getCollection(collectionId);
    if (!collection) {
      throw new Error(`Raccolta ${collectionId} non trovata`);
    }

    if (!collection[section]) {
      throw new Error(`Sezione ${section} non trovata nella raccolta`);
    }

    const updates = { [section]: sectionUpdates };
    
    // Calcola versione basata sul tipo di sezione
    const versionType = this.getSectionVersionType(section);
    options.versionType = options.versionType || versionType;
    options.sectionUpdate = true;

    return await this.updateCollection(collectionId, updates, options);
  }

  /**
   * Aggiornamento batch di più sezioni
   * @param {string} collectionId - ID della raccolta
   * @param {object} batchUpdates - Mappa sezione -> aggiornamenti
   * @param {object} options - Opzioni
   */
  async batchUpdate(collectionId, batchUpdates, options = {}) {
    const results = [];
    options.batch = true;

    for (const [section, updates] of Object.entries(batchUpdates)) {
      try {
        const result = await this.updateSection(collectionId, section, updates, {
          ...options,
          batchIndex: results.length,
          totalBatchItems: Object.keys(batchUpdates).length
        });
        results.push({ section, result });
      } catch (error) {
        results.push({ section, error: error.message });
      }
    }

    return {
      collectionId,
      batchResults: results,
      successCount: results.filter(r => r.result).length,
      errorCount: results.filter(r => r.error).length
    };
  }

  /**
   * Rollback a versione precedente
   * @param {string} collectionId - ID della raccolta
   * @param {string} targetVersion - Versione target per rollback
   * @param {object} options - Opzioni rollback
   */
  async rollbackToVersion(collectionId, targetVersion, options = {}) {
    const history = this.historyManager.getHistory(collectionId);
    if (!history) {
      throw new Error(`Cronologia non trovata per raccolta ${collectionId}`);
    }

    const targetEntry = history.entries.find(e => e.version === targetVersion);
    if (!targetEntry) {
      throw new Error(`Versione ${targetVersion} non trovata nella cronologia`);
    }

    const currentCollection = this.collector.getCollection(collectionId);
    const rollbackData = targetEntry.newValue;

    // Crea backup pre-rollback
    const backupId = await this.createPreUpdateBackup(collectionId, `rollback-from-${currentCollection.version}`);

    // Esegue rollback
    this.collector.collections.set(collectionId, rollbackData);

    // Registra il rollback nella cronologia
    this.historyManager.recordChange(
      collectionId,
      'collection.rolled_back',
      `Rolled back from ${currentCollection.version} to ${targetVersion}`,
      currentCollection,
      rollbackData,
      targetVersion,
      {
        rollbackType: 'version',
        targetVersion,
        backupId,
        reason: options.reason || 'Manual rollback'
      }
    );

    return {
      success: true,
      collectionId,
      rolledBackFrom: currentCollection.version,
      rolledBackTo: targetVersion,
      backupId
    };
  }

  /**
   * Rollback usando snapshot
   * @param {string} collectionId - ID della raccolta
   * @param {string} snapshotId - ID dello snapshot
   * @param {object} options - Opzioni
   */
  async rollbackToSnapshot(collectionId, snapshotId, options = {}) {
    const restoredData = this.historyManager.restoreFromSnapshot(collectionId, snapshotId);
    
    // Aggiorna la raccolta
    this.collector.collections.set(collectionId, restoredData);

    return {
      success: true,
      collectionId,
      snapshotId,
      restoredVersion: restoredData.version
    };
  }

  /**
   * Programma aggiornamento automatico
   * @param {string} collectionId - ID della raccolta
   * @param {object} schedule - Configurazione scheduling
   * @param {function} updateFunction - Funzione di aggiornamento
   */
  scheduleUpdate(collectionId, schedule, updateFunction) {
    const scheduleId = `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.scheduledUpdates.set(scheduleId, {
      id: scheduleId,
      collectionId,
      schedule,
      updateFunction,
      createdAt: new Date(),
      status: 'scheduled',
      lastRun: null,
      nextRun: this.calculateNextRun(schedule)
    });

    return scheduleId;
  }

  /**
   * Analiza differenze tra versioni
   * @param {string} collectionId - ID della raccolta
   * @param {string} version1 - Prima versione
   * @param {string} version2 - Seconda versione
   */
  async analyzeDifferences(collectionId, version1, version2) {
    const comparison = this.historyManager.compareVersions(collectionId, version1, version2);
    
    return {
      ...comparison,
      analysis: {
        breakingChanges: this.detectBreakingChanges(comparison.diff),
        impactAssessment: this.assessImpact(comparison.diff),
        migrationNotes: this.generateMigrationNotes(comparison.diff),
        compatibility: this.checkCompatibility(comparison.diff)
      }
    };
  }

  /**
   * Genera changelog automatico
   * @param {string} collectionId - ID della raccolta
   * @param {string} fromVersion - Versione di partenza
   * @param {string} toVersion - Versione di arrivo
   */
  async generateChangelog(collectionId, fromVersion, toVersion) {
    const history = this.historyManager.getHistory(collectionId);
    
    const relevantEntries = history.entries.filter(entry => {
      const entryVersion = entry.version;
      return this.isVersionInRange(entryVersion, fromVersion, toVersion);
    });

    const changelog = {
      collectionId,
      fromVersion,
      toVersion,
      generatedAt: new Date(),
      sections: {
        added: [],
        changed: [],
        deprecated: [],
        removed: [],
        fixed: [],
        security: []
      },
      breakingChanges: [],
      migrationGuide: []
    };

    // Categorizza cambiamenti
    relevantEntries.forEach(entry => {
      const category = this.categorizeChange(entry);
      changelog.sections[category].push({
        description: entry.description,
        version: entry.version,
        timestamp: entry.timestamp,
        changeType: entry.changeType
      });

      if (entry.metadata.impactLevel === 'high') {
        changelog.breakingChanges.push(entry);
      }
    });

    return changelog;
  }

  /**
   * Valida aggiornamenti prima dell'applicazione
   */
  async preUpdateValidation(collectionId, updates, options) {
    const collection = this.collector.getCollection(collectionId);
    
    // Valida struttura updates
    if (!updates || typeof updates !== 'object') {
      throw new Error('Updates deve essere un oggetto valido');
    }

    // Esegue validators registrati
    for (const [name, validator] of this.validators) {
      const result = await validator(collection, updates, options);
      if (!result.valid) {
        throw new Error(`Validazione ${name} fallita: ${result.error}`);
      }
    }

    return { valid: true };
  }

  /**
   * Calcola nuova versione semantica
   */
  async calculateNewVersion(collectionId, updates, options) {
    const collection = this.collector.getCollection(collectionId);
    const currentVersion = collection.version || '1.0.0';
    
    if (options.version) {
      return options.version; // Versione manuale specificata
    }

    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    // Determina tipo di versione basato sui cambiamenti
    const versionType = options.versionType || this.determineVersionType(updates);
    
    switch (versionType) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
      default:
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  /**
   * Applica gli aggiornamenti effettivi
   */
  async applyUpdates(collectionId, updates, newVersion, options) {
    const collection = this.collector.getCollection(collectionId);
    const previousVersion = collection.version;

    // Applica aggiornamenti
    const updatedCollection = this.collector.updateCurrentCollection(updates);
    updatedCollection.version = newVersion;
    updatedCollection.updatedAt = new Date();

    return {
      previousVersion,
      newVersion,
      updatedCollection,
      changesApplied: Object.keys(updates)
    };
  }

  /**
   * Registra cambiamenti nella cronologia
   */
  async recordHistoryChanges(collectionId, updates, result, newVersion, options) {
    for (const [section, sectionUpdates] of Object.entries(updates)) {
      const changeType = this.getChangeTypeForSection(section);
      
      this.historyManager.recordChange(
        collectionId,
        changeType,
        `Updated ${section}: ${this.summarizeUpdates(sectionUpdates)}`,
        result.updatedCollection[section], // old value
        sectionUpdates, // new value
        newVersion,
        {
          section,
          updateType: options.versionType || 'patch',
          batch: options.batch || false,
          automated: options.automated || false,
          author: options.author || 'system'
        }
      );
    }
  }

  /**
   * Crea backup pre-update
   */
  async createPreUpdateBackup(collectionId, version) {
    const collection = this.collector.getCollection(collectionId);
    
    const snapshot = this.historyManager.createSnapshot(
      collectionId,
      collection,
      `Pre-update backup for version ${version}`,
      { automatic: true, preUpdate: true }
    );

    return snapshot.id;
  }

  /**
   * Cleanup post-update
   */
  async postUpdateCleanup(collectionId) {
    // Pulisce snapshot vecchi se necessario
    const snapshots = this.historyManager.getSnapshots(collectionId);
    if (snapshots.length > 100) {
      // Mantieni solo i 50 più recenti
      const toDelete = snapshots.slice(50);
      toDelete.forEach(snapshot => {
        this.historyManager.snapshots.delete(snapshot.id);
      });
    }

    // Ottimizza cronologia se necessario
    const history = this.historyManager.getHistory(collectionId);
    if (history.entries.length > 1000) {
      // Archivia entries vecchi
      await this.archiveOldHistoryEntries(collectionId);
    }
  }

  /**
   * Gestisce errori durante aggiornamento
   */
  async handleUpdateError(collectionId, updates, error, options) {
    // Log dell'errore
    this.historyManager.recordChange(
      collectionId,
      'update.failed',
      `Update failed: ${error.message}`,
      null,
      { error: error.message, updates },
      'error',
      {
        errorType: error.constructor.name,
        stackTrace: error.stack,
        automated: options.automated || false
      }
    );

    // Se c'è un backup, potremmo fare rollback automatico
    if (options.autoRollback && options.backupId) {
      try {
        await this.rollbackToSnapshot(collectionId, options.backupId, {
          reason: `Auto-rollback after error: ${error.message}`
        });
      } catch (rollbackError) {
        console.error('Failed to auto-rollback:', rollbackError);
      }
    }
  }

  /**
   * Utility methods per validazione e helpers
   */
  registerValidator(name, validatorFunction) {
    this.validators.set(name, validatorFunction);
  }

  registerHook(hookName, hookFunction) {
    if (!this.hooks[hookName]) {
      this.hooks[hookName] = [];
    }
    this.hooks[hookName].push(hookFunction);
  }

  async executeHooks(hookName, context) {
    const hooks = this.hooks[hookName] || [];
    for (const hook of hooks) {
      await hook(context);
    }
  }

  validateSemanticVersion(collection, updates, options) {
    if (options.version) {
      const versionRegex = /^\d+\.\d+\.\d+$/;
      if (!versionRegex.test(options.version)) {
        return { valid: false, error: 'Versione non nel formato semantic version' };
      }
    }
    return { valid: true };
  }

  validateBreakingChanges(collection, updates, options) {
    // Logica per rilevare breaking changes
    const breakingSections = ['colors.modules', 'components', 'typography.fontFamilies'];
    const hasBreakingChanges = Object.keys(updates).some(key => 
      breakingSections.some(section => key.startsWith(section))
    );

    if (hasBreakingChanges && options.versionType !== 'major') {
      return { 
        valid: false, 
        error: 'Breaking changes rilevati ma versionType non è "major"' 
      };
    }

    return { valid: true };
  }

  validateAccessibility(collection, updates, options) {
    // Controlli di accessibilità
    if (updates.colors) {
      // Verifica contrasti
      // Implementazione semplificata
    }
    return { valid: true };
  }

  validatePerformance(collection, updates, options) {
    // Controlli di performance
    const updateSize = JSON.stringify(updates).length;
    if (updateSize > 1000000) { // 1MB
      return { 
        valid: false, 
        error: 'Update troppo grande, potrebbe impattare le performance' 
      };
    }
    return { valid: true };
  }

  determineVersionType(updates) {
    const breakingChanges = ['theme', 'colors.modules', 'components.buttons'];
    const minorChanges = ['components', 'icons', 'animations'];
    
    for (const key of Object.keys(updates)) {
      if (breakingChanges.some(bc => key.startsWith(bc))) {
        return 'major';
      }
      if (minorChanges.some(mc => key.startsWith(mc))) {
        return 'minor';
      }
    }
    
    return 'patch';
  }

  getSectionVersionType(section) {
    const versionMap = {
      'theme': 'major',
      'colors': 'minor',
      'typography': 'minor',
      'components': 'minor',
      'icons': 'patch',
      'animations': 'patch',
      'layout': 'patch',
      'accessibility': 'patch',
      'technical': 'patch'
    };

    return versionMap[section] || 'patch';
  }

  getChangeTypeForSection(section) {
    const changeTypeMap = {
      'theme': 'theme.changed',
      'colors': 'colors.updated',
      'typography': 'typography.updated',
      'components': 'components.modified',
      'icons': 'icons.added',
      'animations': 'animations.added',
      'layout': 'layout.updated',
      'accessibility': 'accessibility.improved',
      'technical': 'technical.updated'
    };

    return changeTypeMap[section] || 'collection.modified';
  }

  summarizeUpdates(updates) {
    if (typeof updates === 'object') {
      const keys = Object.keys(updates);
      return `${keys.length} changes (${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''})`;
    }
    return 'Updated';
  }

  async postUpdateValidation(collectionId, result) {
    // Validazioni post-update
    const collection = result.updatedCollection;
    
    // Verifica integrità struttura
    if (!collection.version || !collection.updatedAt) {
      throw new Error('Raccolta aggiornata manca di campi essenziali');
    }

    return { valid: true };
  }

  calculateNextRun(schedule) {
    // Implementazione semplificata scheduling
    const now = new Date();
    if (schedule.type === 'interval') {
      return new Date(now.getTime() + schedule.intervalMs);
    }
    // Altri tipi di schedule...
    return null;
  }

  isVersionInRange(version, fromVersion, toVersion) {
    // Implementazione semplificata confronto versioni
    return true; // TODO: implementare logica di confronto semantica
  }

  categorizeChange(entry) {
    const categoryMap = {
      'collection.created': 'added',
      'colors.updated': 'changed',
      'components.added': 'added',
      'components.modified': 'changed',
      'icons.added': 'added',
      'animations.added': 'added',
      'accessibility.improved': 'changed',
      'technical.updated': 'changed'
    };

    return categoryMap[entry.changeType] || 'changed';
  }

  detectBreakingChanges(diff) {
    // Rileva breaking changes da diff
    return [];
  }

  assessImpact(diff) {
    // Valuta impatto cambiamenti
    return { level: 'low', areas: [] };
  }

  generateMigrationNotes(diff) {
    // Genera note di migrazione
    return [];
  }

  checkCompatibility(diff) {
    // Controlla compatibilità
    return { compatible: true, warnings: [] };
  }

  async archiveOldHistoryEntries(collectionId) {
    // Archivia entries vecchi
    // TODO: implementare archiviation
  }
}

export default UpdateProcedure;