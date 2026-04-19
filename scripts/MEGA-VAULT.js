<%*
// ==========================================
// ⚙️ MEGA-VAULT CONFIGURATION
// ==========================================
const CONFIG = {
    // LINKING CONTROLS
    SIMILARITY_THRESHOLD: 15,        // Only ELITE connections (adjust 10-20)
    MAX_CONNECTIONS_PER_FILE: 12,    // Top N most similar (adjust 8-15)
    ENABLE_LINKING: true,             // Set false to skip Phase 2
    
    // PERFORMANCE
    BATCH_DELAY: 50,                  // ms between file operations
    PROGRESS_INTERVAL: 25,            // Show progress every N files
    
    // EXCLUSIONS
    EXCLUDE_FOLDERS: [
        "Dashboard", 
        "Templates", 
        ".trash",
        ".obsidian",
        ".space",
        "copilot-conversations"
    ]
};

// ==========================================
// VAULT DETECTION & SMART FOLDER SELECT
// ==========================================

const vaultName = app.vault.getName();
new Notice(`🎯 Mega-Vault Mode: ${vaultName}`, 3000);

const folderPath = await tp.system.prompt(
    `[${vaultName}] Enter folder path\n\n` +
    `• Type "all" for ENTIRE vault (1300+ files!)\n` +
    `• Or specific folder like "01-Meta-Agents"\n` +
    `• Or hit Cancel to abort`
);

if (!folderPath || folderPath.trim() === "") {
    new Notice("❌ Cancelled!");
    return;
}

// ==========================================
// FILE COLLECTION WITH SMART FILTERING
// ==========================================

const allFiles = app.vault.getMarkdownFiles().filter(f => {
    // Exclude system folders
    for (const exclude of CONFIG.EXCLUDE_FOLDERS) {
        if (f.path.includes(exclude)) return false;
    }
    return true;
});

const files = folderPath.toLowerCase() === 'all' 
    ? allFiles
    : allFiles.filter(f => f.path.startsWith(folderPath));

if (files.length === 0) {
    new Notice(`❌ No files found in '${folderPath}'`);
    return;
}

// Confirmation for massive operations
if (files.length > 500) {
    const confirm = await tp.system.prompt(
        `⚠️ WARNING: About to process ${files.length} files!\n\n` +
        `This could take 30-60+ minutes.\n` +
        `Type "PROCEED" to continue:`
    );
    
    if (confirm !== "PROCEED") {
        new Notice("❌ Operation cancelled");
        return;
    }
}

new Notice(`🚀 Phase 1: Analyzing ${files.length} system prompts...`, 5000);

// ==========================================
// PHASE 1: ULTRA-FAST ANALYSIS
// ==========================================

let processed = 0;
let errors = 0;
const startTime = Date.now();
const fileMetadata = new Map();

for (const file of files) {
    try {
        const content = await app.vault.read(file);
        
        // Calculate metrics
        const charCount = content.length;
        const tokenCount = Math.ceil(charCount / 4);
        
        // Size category
        let sizeCategory = "small";
        if (tokenCount > 4000) sizeCategory = "mega";
        else if (tokenCount > 2000) sizeCategory = "xlarge";
        else if (tokenCount > 1000) sizeCategory = "large";
        else if (tokenCount > 500) sizeCategory = "medium";
        
        // OUTPUT FORMAT DETECTION
        const outputFormats = [];
        const formatPatterns = {
            "markdown": /markdown|##|###|\*\*/i,
            "json": /JSON|\.json|{[\s\S]{0,100}}/i,
            "xml": /XML|<[^>]+>/i,
            "yaml": /YAML|yml|^[\s]*-\s+\w+:/im,
            "code-blocks": /```/i,
            "tables": /\|.*\|/i,
            "structured-data": /structure|format|template|schema/i
        };
        
        for (const [key, pattern] of Object.entries(formatPatterns)) {
            if (pattern.test(content)) outputFormats.push(key);
        }
        
        // CONSTRAINTS DETECTION
        const constraints = [];
        const constraintPatterns = {
            "strict-rules": /must|required|mandatory|always|never/i,
            "length-limits": /character limit|max.*length|token limit|brief|concise/i,
            "forbidden-content": /do not|don't|avoid|exclude|omit/i,
            "required-elements": /must include|always.*include|required/i,
            "formatting-rules": /format.*as|structure.*like|follow.*template/i,
            "tone-requirements": /professional|formal|casual|technical|friendly/i,
            "scope-boundaries": /only|exclusively|limited to|restricted to|focus on/i,
            "ethical-bounds": /ethical|legal|compliant|appropriate|safe/i,
            "citation-rules": /cite|source|reference|attribution/i,
            "accuracy-requirements": /accurate|factual|verified|precise/i
        };
        
        for (const [key, pattern] of Object.entries(constraintPatterns)) {
            if (pattern.test(content)) constraints.push(key);
        }
        
        // ==========================================
        // 🔥 ENHANCED ROLE DETECTION (NEW!)
        // ==========================================
        
        let role = "assistant";
        let subRole = ""; // Sub-classification for extra precision
        
        // TIER 1: Specific roles (check these first - most precise!)
        const specificRoles = {
            "system-prompt-analyzer": /sp.?analy[sz]|prompt.?analy[sz]|analyze.*prompt|prompt.*review/i,
            "system-prompt-optimizer": /sp.?optimi[sz]|prompt.?optimi[sz]|optimize.*prompt|prompt.*enhance/i,
            "meta-orchestrator": /orchestrat.*meta|meta.*orchestrat|multi.agent.*coord/i,
            "coding-agent": /coding.*agent|code.*assist|programming.*agent|can.?agent/i,
            "research-agent": /research.*agent|investigat.*agent|softwiz|shadow.*esoteric/i,
            "prompt-engineer": /prompt.*engineer|prompt.*craft|prompt.*design|promptforge/i,
            "workflow-automator": /workflow|automation.*expert|process.*automat/i,
            "rag-specialist": /rag|retrieval.*augment|vector.*search|embed/i,
            "platform-optimizer": /platform.*optim|vs.?code.*optim|cursor.*agent/i,
            "documentation-specialist": /document.*assist|doc.*agent|geminidoc/i,
            "integration-expert": /integration.*expert|dust.*expert|platform.*integration/i
        };
        
        // Check specific roles first (filename + content)
        for (const [key, pattern] of Object.entries(specificRoles)) {
            if (pattern.test(content) || pattern.test(file.basename)) {
                role = key;
                break;
            }
        }
        
        // TIER 2: Generic roles (fallback if no specific match)
        if (role === "assistant") {
            const genericRoles = {
                "meta-agent": /meta.agent|orchestrat|multi.agent|coordinator/i,
                "expert": /expert|specialist|master|authority/i,
                "analyst": /analy[sz]e|research|investigate|examine/i,
                "developer": /code|develop|program|engineer|software/i,
                "architect": /architect|design|system.*design|framework/i,
                "optimizer": /optimi[sz]e|enhance|improve|refine/i,
                "strategist": /strateg|plan|tactical/i,
                "researcher": /research|scholar|investigate/i,
                "advisor": /advise|consult|recommend|guide|mentor/i
            };
            
            for (const [key, pattern] of Object.entries(genericRoles)) {
                if (pattern.test(content)) {
                    role = key;
                    break;
                }
            }
        }
        
        // TIER 3: Sub-role detection (adds platform/version specificity)
        const subRolePatterns = {
            "perplexity-agent": /perplexity/i,
            "cursor-agent": /cursor/i,
            "copilot-agent": /copilot|github.*copilot/i,
            "claude-agent": /claude/i,
            "wordpress-agent": /wordpress|wp.*agent/i,
            "dust-agent": /dust\.tt|dusttt/i,
            "prometheus": /prometheus/i,
            "nexus": /nexus.*kop|kop.*infinity/i,
            "softwiz": /softwiz|shadowtech/i,
            "shadow-esoteric": /shadow.*esoteric/i,
            "roo-code": /roo.*code|roo.*mastery/i,
            "windsurf": /windsurf/i,
            "bolt": /bolt\.new/i
        };
        
        for (const [key, pattern] of Object.entries(subRolePatterns)) {
            if (pattern.test(content) || pattern.test(file.basename)) {
                subRole = key;
                break;
            }
        }
        
        // ==========================================
        // END ENHANCED ROLE DETECTION
        // ==========================================
        
        // CAPABILITIES
        const capabilities = [];
        const capabilityPatterns = {
            "code-generation": /code|programming|script/i,
            "analysis": /analy[sz]e|examine|evaluate/i,
            "multi-agent": /multi.agent|orchestrat|coordinator/i,
            "reasoning": /reason|think|logic|deduce/i,
            "research": /research|investigate|explore/i,
            "optimization": /optimi[sz]e|improve|enhance/i,
            "automation": /automat|workflow|pipeline/i,
            "technical": /technical|engineering|system/i
        };
        
        for (const [key, pattern] of Object.entries(capabilityPatterns)) {
            if (pattern.test(content)) capabilities.push(key);
        }
        
        // TECHNIQUES
        const techniques = [];
        const techniquePatterns = {
            "chain-of-thought": /step.by.step|chain of thought|reasoning/i,
            "few-shot": /example|for instance|such as.*:/i,
            "role-playing": /you are|act as|persona/i,
            "meta-prompting": /prompt|meta|instruction/i,
            "tree-of-thought": /tree of thought|multiple paths|branch/i,
            "decomposition": /break down|decompose|divide/i,
            "retrieval-augmented": /RAG|retrieval|knowledge base/i
        };
        
        for (const [key, pattern] of Object.entries(techniquePatterns)) {
            if (pattern.test(content)) techniques.push(key);
        }
        
        // TOOLS
        const tools = [];
        const toolPatterns = {
            "web-search": /search|browse|internet/i,
            "code-execution": /execute|run code|python/i,
            "file-operations": /file|read|write/i,
            "api-calls": /API|endpoint|fetch/i,
            "mcp-tools": /MCP|tool.*call/i
        };
        
        for (const [key, pattern] of Object.entries(toolPatterns)) {
            if (pattern.test(content)) tools.push(key);
        }
        
        // DOMAINS
        const domains = [];
        const domainPatterns = {
            "ai-ml": /AI|machine learning|LLM|model/i,
            "web-dev": /web.*dev|frontend|backend|React/i,
            "automation": /automation|workflow|pipeline/i,
            "research": /research|analysis|investigation/i,
            "meta-engineering": /meta|orchestrat|multi.agent/i
        };
        
        for (const [key, pattern] of Object.entries(domainPatterns)) {
            if (pattern.test(content)) domains.push(key);
        }
        
        // SOPHISTICATION
        let sophistication = "standard";
        const sophScore = 
            (techniques.length * 2) + 
            (constraints.length * 1.5) + 
            (capabilities.length * 1) + 
            (outputFormats.length * 1) +
            (tools.length * 1);
        
        if (sophScore > 25) sophistication = "elite";
        else if (sophScore > 18) sophistication = "advanced";
        else if (sophScore > 12) sophistication = "sophisticated";
        else if (sophScore > 6) sophistication = "intermediate";
        
        // Store metadata
        fileMetadata.set(file.path, {
            file,
            role,
            subRole,  // NEW!
            capabilities,
            techniques,
            tools,
            outputFormats,
            constraints,
            domains,
            sophistication,
            sizeCategory
        });
        
        // BUILD FRONTMATTER (Updated with sub-role!)
        const frontmatter = `---
type: system-prompt
vault: ${vaultName}
analyzed: ${tp.date.now("YYYY-MM-DD HH:mm")}
char-count: ${charCount}
token-estimate: ${tokenCount}
size-category: ${sizeCategory}
sophistication: ${sophistication}
role: ${role}
${subRole ? `sub-role: ${subRole}\n` : ''}capabilities:
${capabilities.length > 0 ? capabilities.map(c => `  - ${c}`).join('\n') : '  - general'}
techniques:
${techniques.length > 0 ? techniques.map(t => `  - ${t}`).join('\n') : '  - standard'}
output-formats:
${outputFormats.length > 0 ? outputFormats.map(f => `  - ${f}`).join('\n') : '  - plain-text'}
constraints:
${constraints.length > 0 ? constraints.map(c => `  - ${c}`).join('\n') : '  - flexible'}
domains:
${domains.length > 0 ? domains.map(d => `  - ${d}`).join('\n') : '  - general'}
tools:
${tools.length > 0 ? tools.map(t => `  - ${t}`).join('\n') : '  - none'}
status: active
---

`;
        
        // Update file
        let cleanContent = content.replace(/^---[\s\S]*?---\n\n?/, '');
        const newContent = frontmatter + cleanContent;
        
        await app.vault.modify(file, newContent);
        
        processed++;
        
        if (processed % CONFIG.PROGRESS_INTERVAL === 0) {
            const percent = Math.round((processed / files.length) * 100);
            new Notice(`⏳ Phase 1: ${processed}/${files.length} (${percent}%)...`);
        }
        
        await new Promise(r => setTimeout(r, CONFIG.BATCH_DELAY));
        
    } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        errors++;
    }
}

const phase1Duration = Math.round((Date.now() - startTime) / 1000);
new Notice(`✅ Phase 1 Complete in ${phase1Duration}s!`, 3000);

// ==========================================
// PHASE 2: SMART LINKING (OPTIONAL)
// ==========================================

if (!CONFIG.ENABLE_LINKING) {
    new Notice("⏭️ Linking skipped (disabled in config)");
    tR = `# Analysis Complete\n\n**Tagged:** ${processed} files\n**Linking:** Disabled`;
    return;
}

new Notice(`🔗 Phase 2: Building similarity matrix...`, 0);

const connections = [];
const metaArray = Array.from(fileMetadata.values());

// Calculate similarities
for (let i = 0; i < metaArray.length; i++) {
    if (i % 100 === 0) {
        new Notice(`🔗 Analyzing connections: ${i}/${metaArray.length}...`);
    }
    
    for (let j = i + 1; j < metaArray.length; j++) {
        const metaA = metaArray[i];
        const metaB = metaArray[j];
        
        let score = 0;
        
        // Same role = +3
        if (metaA.role === metaB.role) score += 3;
        
        // Same sub-role = +2 (NEW!)
        if (metaA.subRole && metaB.subRole && metaA.subRole === metaB.subRole) score += 2;
        
        // Shared capabilities = +2 each
        const sharedCaps = metaA.capabilities.filter(c => metaB.capabilities.includes(c));
        score += sharedCaps.length * 2;
        
        // Shared techniques = +4 each (MOST IMPORTANT)
        const sharedTechs = metaA.techniques.filter(t => metaB.techniques.includes(t));
        score += sharedTechs.length * 4;
        
        // Shared output formats = +2 each
        const sharedFormats = metaA.outputFormats.filter(f => metaB.outputFormats.includes(f));
        score += sharedFormats.length * 2;
        
        // Shared constraints = +2 each
        const sharedConstraints = metaA.constraints.filter(c => metaB.constraints.includes(c));
        score += sharedConstraints.length * 2;
        
        // Shared domains = +3 each
        const sharedDomains = metaA.domains.filter(d => metaB.domains.includes(d));
        score += sharedDomains.length * 3;
        
        // Shared tools = +1 each
        const sharedTools = metaA.tools.filter(t => metaB.tools.includes(t));
        score += sharedTools.length * 1;
        
        // Same sophistication = +2
        if (metaA.sophistication === metaB.sophistication) score += 2;
        
        // HIGH THRESHOLD for mega vaults
        if (score >= CONFIG.SIMILARITY_THRESHOLD) {
            connections.push({
                fileA: metaA.file,
                fileB: metaB.file,
                score,
                shared: {
                    capabilities: sharedCaps,
                    techniques: sharedTechs,
                    formats: sharedFormats,
                    constraints: sharedConstraints,
                    domains: sharedDomains
                }
            });
        }
    }
}

new Notice(`🔗 Found ${connections.length} strong connections!`, 3000);

// ==========================================
// CONNECTION LIMITING (PREVENT OVERLOAD)
// ==========================================

if (connections.length > files.length * 5) {
    new Notice(`⚠️ Too many connections! Limiting to top ${CONFIG.MAX_CONNECTIONS_PER_FILE} per file...`);
    
    const fileConnMap = new Map();
    
    // Group by file
    for (const conn of connections) {
        if (!fileConnMap.has(conn.fileA.path)) fileConnMap.set(conn.fileA.path, []);
        if (!fileConnMap.has(conn.fileB.path)) fileConnMap.set(conn.fileB.path, []);
        
        fileConnMap.get(conn.fileA.path).push({...conn, primaryFile: 'A'});
        fileConnMap.get(conn.fileB.path).push({...conn, primaryFile: 'B'});
    }
    
    // Keep only top N per file
    const limitedConnections = [];
    const processed = new Set();
    
    for (const [filePath, conns] of fileConnMap.entries()) {
        const sorted = conns.sort((a, b) => b.score - a.score).slice(0, CONFIG.MAX_CONNECTIONS_PER_FILE);
        
        for (const c of sorted) {
            const key = [c.fileA.path, c.fileB.path].sort().join('|');
            if (!processed.has(key)) {
                limitedConnections.push({
                    fileA: c.fileA,
                    fileB: c.fileB,
                    score: c.score,
                    shared: c.shared
                });
                processed.add(key);
            }
        }
    }
    
    connections.length = 0;
    connections.push(...limitedConnections);
    
    new Notice(`✅ Reduced to ${connections.length} high-quality connections`);
}

// ==========================================
// APPLY BIDIRECTIONAL LINKS
// ==========================================

let linked = 0;
new Notice(`🔗 Applying ${connections.length} connections...`, 0);

for (const conn of connections) {
    try {
        // Update File A
        let contentA = await app.vault.read(conn.fileA);
        const linkB = `[[${conn.fileB.basename}]]`;
        
        if (!contentA.includes('## 🔗 Connected Prompts')) {
            contentA += `\n\n---\n## 🔗 Connected Prompts\n`;
        }
        
        if (!contentA.includes(linkB)) {
            const sharedInfo = [
                ...conn.shared.techniques.map(t => `#${t}`),
                ...conn.shared.domains.map(d => `#${d}`)
            ].slice(0, 2).join(' ');
            
            contentA += `- ${linkB} _(${conn.score}) ${sharedInfo}_\n`;
            await app.vault.modify(conn.fileA, contentA);
        }
        
        // Update File B
        let contentB = await app.vault.read(conn.fileB);
        const linkA = `[[${conn.fileA.basename}]]`;
        
        if (!contentB.includes('## 🔗 Connected Prompts')) {
            contentB += `\n\n---\n## 🔗 Connected Prompts\n`;
        }
        
        if (!contentB.includes(linkA)) {
            const sharedInfo = [
                ...conn.shared.techniques.map(t => `#${t}`),
                ...conn.shared.domains.map(d => `#${d}`)
            ].slice(0, 2).join(' ');
            
            contentB += `- ${linkA} _(${conn.score}) ${sharedInfo}_\n`;
            await app.vault.modify(conn.fileB, contentB);
        }
        
        linked++;
        
        if (linked % 50 === 0) {
            const percent = Math.round((linked / connections.length) * 100);
            new Notice(`⏳ Phase 2: ${linked}/${connections.length} (${percent}%)...`);
        }
        
        await new Promise(r => setTimeout(r, CONFIG.BATCH_DELAY));
        
    } catch (error) {
        console.error(`Error linking:`, error);
    }
}

const totalDuration = Math.round((Date.now() - startTime) / 1000);
const minutes = Math.floor(totalDuration / 60);
const seconds = totalDuration % 60;

new Notice(`🎉 COMPLETE! ${minutes}m ${seconds}s`, 5000);

// ==========================================
// MEGA-VAULT REPORT
// ==========================================

const sophBreakdown = {};
for (const meta of fileMetadata.values()) {
    sophBreakdown[meta.sophistication] = (sophBreakdown[meta.sophistication] || 0) + 1;
}

const roleBreakdown = {};
for (const meta of fileMetadata.values()) {
    roleBreakdown[meta.role] = (roleBreakdown[meta.role] || 0) + 1;
}

const domainCounts = {};
for (const meta of fileMetadata.values()) {
    for (const domain of meta.domains) {
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    }
}
const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b - a)[19]
    .slice(0, 5);

tR = `# 🚀 Mega-Vault Analysis: ${vaultName}

## Phase 1: Tagging
- **Processed:** ${processed} files
- **Errors:** ${errors}
- **Duration:** ${phase1Duration}s

## Phase 2: Smart Linking
- **Connections:** ${linked} bidirectional pairs
- **Avg Similarity:** ${connections.length > 0 ? Math.round(connections.reduce((sum, c) => sum + c.score, 0) / connections.length) : 0}
- **Threshold Used:** ${CONFIG.SIMILARITY_THRESHOLD} (only elite matches)

## 📊 Top Connected Files
${connections
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(c => `- [[${c.fileA.basename}]] ↔️ [[${c.fileB.basename}]] (${c.score})`)
    .join('\n')}

## 🎯 Role Breakdown (NEW!)
${Object.entries(roleBreakdown)
    .sort((a, b) => b - a)[19]
    .map(([role, count]) => `- **${role}**: ${count} prompts`)
    .join('\n')}

## 🎯 Sophistication Breakdown
${Object.entries(sophBreakdown)
    .sort((a, b) => b - a)[19]
    .map(([level, count]) => `- **${level}**: ${count} prompts`)
    .join('\n')}

## 🌐 Top Domains
${topDomains.length > 0
    ? topDomains.map(([domain, count]) => `- \`${domain}\`: ${count} prompts`).join('\n')
    : '- No domains detected'}

---
**Folder:** \`${folderPath}\`
**Vault:** ${vaultName}
**Total Time:** ${minutes}m ${seconds}s
**Completed:** ${tp.date.now("YYYY-MM-DD HH:mm")}

> [!success] Graph View Ready!
> Try these filters:
> - \`line:sophistication: elite\`
> - \`line:role: system-prompt-analyzer\`
> - \`line:sub-role: perplexity-agent\`
> - \`line:domains: meta-engineering\`
> - \`line:(similarity.*[2-9][0-9])\` (score 20+)
`;
_%>