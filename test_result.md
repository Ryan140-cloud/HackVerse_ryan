#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  HackVerse SaaS — student hackathon discovery platform.
  Continue development from previous handoff. Priorities in order:
  P0: Migrate hackathon data source to PostgreSQL, replace all Unicode escapes,
      fix multi-filter simultaneous selection on Explore, improve UI spacing.
  P1: Mount global AI chat widget (Emergent Universal LLM Key), build admin
      moderation UI for community submissions, wire dashboard bookmarks/notifications
      to Prisma, add admin dashboard analytics charts.
  P2: Perf optimizations (skeleton loaders, lazy loading).

backend:
  - task: "Postgres-backed hackathon API (/api/hackathons, /api/featured, /api/trending, /api/ongoing, /api/upcoming, /api/categories)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js, lib/data/db.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Rewrote the catch-all API to query Prisma via lib/data/db.js. Normalises Prisma rows to legacy shape (Online/Hybrid/Offline mode, computed status from dates, _startMs/_endMs/_registerMs). Added multi-value filter support (comma-separated or repeated params) for status/source/mode/category/tag. Verified via curl: GET /api/hackathons returns count:12."

  - task: "AI chat backend /api/chat via Emergent Universal LLM Key"
    implemented: true
    working: true
    file: "app/api/chat/route.js, .env (EMERGENT_LLM_KEY)"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "New route uses `emergentintegrations` NPM package (LlmChat/UserMessage) with openai/gpt-4o-mini via the Emergent proxy. Grounds the model in live PostgreSQL catalogue (top 40 active hackathons). Returns { text, hackathons, model }. Verified via curl — returned real hackathon recommendations."

  - task: "Admin submissions moderation API /api/admin/submissions (GET/PATCH/DELETE)"
    implemented: true
    working: "NA"
    file: "app/api/admin/submissions/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "New admin-gated endpoints. Lists community submissions, allows Approve/Reject/Archive/Delete with audit logging. Not tested yet."

frontend:
  - task: "Replace all raw Unicode escape sequences across codebase"
    implemented: true
    working: true
    file: "43 files across app/, components/, lib/"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Ran /tmp/fix_unicode.py to convert every \\uXXXX (including surrogate pairs) to the actual Unicode character. Post-check: 0 remaining. Verified visually via homepage screenshot — em-dashes and curly quotes render correctly."

  - task: "Explore page — multi-filter, search, sort, DB-backed"
    implemented: true
    working: true
    file: "app/explore/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Rewrote the entire Explore page. Categories/Statuses/Sources/Modes are now multi-select via chips + a custom MultiSelect popover. Filters compose with text search. State syncs to URL (shareable links). Fetches from /api/hackathons with debounced text input. Verified screenshots showing 12 results and multi-filter chips."

  - task: "Home page sections (Live/Featured/Trending/Categories) fetch from live DB API"
    implemented: true
    working: true
    file: "components/sections/{live,featured,trending,categories}-hackathons.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "All four sections converted from static imports to client-side fetch against /api/ongoing, /api/featured, /api/trending, /api/categories. Reduced padding from py-20 → py-16 md:py-20 for tighter spacing."

  - task: "Floating AI chat widget mounted globally with live LLM"
    implemented: true
    working: true
    file: "components/ai/chat-widget.jsx, app/layout.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Widget mounted in app/layout.js so it floats on every page. Sends { message, sessionId, prefs } to /api/chat and renders reply + attached hackathon cards. sessionId persisted in localStorage for multi-turn coherence. Screenshot verified panel opens with welcome + suggestion chips."

  - task: "Admin submissions moderation UI"
    implemented: true
    working: "NA"
    file: "app/admin/submissions/page.js, components/admin/admin-shell.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "New /admin/submissions page lists community-submitted hackathons with Approve/Reject/Delete actions. Sidebar updated with Inbox icon link. Not tested end-to-end yet."

metadata:
  created_by: "main_agent"
  version: "1.1"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Admin submissions moderation flow (list, approve/reject/delete)"
    - "Chat widget end-to-end LLM roundtrip"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Session progress:
      - P0 complete: Postgres migration for public hackathon data (API + all sections + Explore), 43 files cleaned of Unicode escapes, Explore page rewritten with multi-select filter chips + shareable URL sync.
      - P1 mostly complete: Emergent LLM Key wired via `emergentintegrations` package for /api/chat (grounded in live catalogue). Chat widget mounted globally. Admin submissions moderation page + API created (not yet tested).
      - Remaining for P1: (a) Wire Dashboard bookmarks/notifications to Prisma (still on localStorage), (b) Replace admin overview mock analytics with live DB aggregates.
      - Awaiting user confirmation before continuing with remaining P1 items or backend testing.

# Test credentials in /app/memory/test_credentials.md
#   Admin: ryan@hackverse.dev / RyanSharma@2025