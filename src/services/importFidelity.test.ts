import { describe, expect, it } from 'vitest';
import {
    buildImportFidelityReport,
    mapErrorToIssue,
    mapParserDiagnosticToIssue,
    mapWarningToIssue,
    summarizeImportReport,
} from './importFidelity';

describe('importFidelity', () => {
    it('maps warning and error messages to taxonomy codes', () => {
        expect(mapWarningToIssue('Imported legacy JSON without version metadata; loaded with compatibility mode.').code).toBe('DOC-001');
        expect(mapErrorToIssue('Unsupported flow file version "2.0".').code).toBe('UNSUP-001');
        expect(mapErrorToIssue('Invalid flow file: missing nodes or edges arrays.').code).toBe('FMT-001');
    });

    it('maps parser diagnostics to structured issues', () => {
        const issue = mapParserDiagnosticToIssue({
            message: 'Unrecognized syntax near token',
            line: 4,
            snippet: 'bad token',
            hint: 'Fix syntax',
        });
        expect(issue.code).toBe('FMT-001');
        expect(issue.severity).toBe('error');
        expect(issue.line).toBe(4);
    });

    it('builds and summarizes import report', () => {
        const report = buildImportFidelityReport({
            source: 'json',
            nodeCount: 3,
            edgeCount: 2,
            elapsedMs: 14,
            issues: [
                { code: 'DOC-001', severity: 'warning', message: 'legacy' },
            ],
        });
        expect(report.status).toBe('success_with_warnings');
        expect(report.summary.warningCount).toBe(1);
        expect(report.summary.errorCount).toBe(0);
        expect(summarizeImportReport(report)).toContain('JSON import');
    });
});
