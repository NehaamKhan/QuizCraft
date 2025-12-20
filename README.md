
# 🚀 **QuizCraft AI — Autonomous Knowledge Extractor + Quiz Builder**

<img width="1917" height="902" alt="Screenshot 2025-12-20 221245" src="https://github.com/user-attachments/assets/d7890b18-a239-4252-8d0a-d3049374a940" />

QuizCraft AI is an **agentic AI system** built with **Next.js, TypeScript, TailwindCSS, and Google’s Genkit AI framework**.
It takes a long educational text and autonomously performs:

✔ **Key concept extraction**
✔ **Hierarchical knowledge structuring**
✔ **Quiz question generation (10 questions)**
✔ **Difficulty ranking (Easy → Medium → Hard)**
✔ **Self-validation of difficulty logic**
✔ **Final structured quiz output**

This project showcases true **agentic behavior** through decomposition, reasoning, ranking logic, and self-correction.

---

# 🧠 **How It Works**

```
            📝 Input: Long Educational Text
                           │
                           ▼
              🔍 Concept Extraction Agent
                           │
                           ▼
             🗂 Hierarchy Builder Agent
                           │
                           ▼
        ❓ Quiz Generator → 10 Questions (MCQ/Conceptual)
                           │
                           ▼
        📊 Difficulty Ranker (Easy/Medium/Hard)
                           │
                           ▼
            🔁 Validator Agent (Self-correcting)
                           │
                           ▼
                    🎯 Final Quiz Output
```

---

# 🧩 **Tech Stack**

| Layer             | Technology                                               |
| ----------------- | -------------------------------------------------------- |
| **Framework**     | Next.js 14 (App Router)                                  |
| **Language**      | TypeScript                                               |
| **AI Engine**     | **Google Genkit** (flows, LLM inference, agent pipeline) |
| **Styling**       | TailwindCSS                                              |
| **UI Components** | shadcn/ui                                                |
| **Build Tools**   | Turbopack / Vite (Next internal)                         |
| **Deployment**    | Vercel / Firebase App Hosting                            |
| **Config Files**  | `next.config.ts`, `genkit.ts`, `apphosting.yaml`         |

---

# 📂 **Project Structure**

```
QuizCraft/
│
├── src/
│   ├── ai/
│   │   ├── genkit.ts         # AI model setup + Genkit config
│   │   ├── dev.ts            # Local dev utilities
│   │   └── flows/            # Main agentic logic
│   │       ├── extract.ts    # Key concept extractor
│   │       ├── hierarchy.ts  # Hierarchical structuring agent
│   │       ├── quiz.ts       # Question generator agent
│   │       ├── ranker.ts     # Difficulty ranking logic
│   │       └── validate.ts   # Self-checking validator
│   │
│   ├── app/
│   │   ├── page.tsx          # Main UI
│   │   └── api/flows         # API endpoints for Genkit flows
│   │
│   ├── components/           # Reusable UI components
│   ├── hooks/
│   ├── lib/
│   └── styles/
│
├── docs/                     # Documentation
├── package.json
├── next.config.ts
├── apphosting.yaml           # Firebase hosting config
└── tailwind.config.ts
```

---

# ⚙️ **Installation & Setup**

### **1. Clone the repository**

```bash
git clone https://github.com/yourusername/QuizCraft.git
cd QuizCraft-main
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Configure Google Genkit AI**

Set your environment variables:

Create `.env.local`:

```bash
GOOGLE_GENKIT_API_KEY=your_key_here
```

### **4. Run the development server**

```bash
npm run dev
```

App runs at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

# 🖥️ **Usage**

1. Paste a large educational text into the input box
2. Click **Generate Quiz**
3. The system autonomously performs:

   * Concept Extraction
   * Hierarchical Structuring
   * Quiz Generation
   * Difficulty Ranking
   * Self-Validation
4. Output appears on screen as:

   * **Extracted Concepts**
   * **Knowledge Hierarchy**
   * **10 Quiz Questions**
   * **Difficulty Labels**
   * **Validation Report**

---

# 📊 **Sample Output**
<img width="1918" height="898" alt="Screenshot 2025-12-20 221724" src="https://github.com/user-attachments/assets/45c5551d-0b30-4d1d-8816-b624a38f8a36" />
<img width="1918" height="905" alt="Screenshot 2025-12-20 221913" src="https://github.com/user-attachments/assets/5b49f834-85ad-4c9a-82e7-58b2bb85305d" />
<img width="1918" height="907" alt="Screenshot 2025-12-20 221937" src="https://github.com/user-attachments/assets/3c0cfe04-bf62-4f2c-bbbe-de44cb3d7938" />


### **Extracted Concepts**

* Photosynthesis
* Chlorophyll
* Light-dependent reaction
* Calvin Cycle
* ATP & NADPH

### **Generated Questions (10)**

1. What is the primary purpose of photosynthesis? ⭐
2. Explain the role of chlorophyll in light absorption. ⭐⭐
3. Compare the Calvin Cycle with the light reaction. ⭐⭐⭐
   … up to 10

### **Difficulty Validation**

```
Validation Summary:
- Q3 moved from Medium → Hard (requires comparative reasoning)
- All difficulty scores consistent
✔ Final difficulty ranking validated.
```

---

# 🧠 **Agentic Flow (from src/ai/flows)**

### 1. **Extractor Agent**

`extract.ts`
Uses LLM to identify key ideas + supporting concepts.

### 2. **Hierarchy Builder**

`hierarchy.ts`
Organizes concepts into a clean structured tree:

```
Topic
 ├── Subtopic
 │    └── Concepts
```

### 3. **Quiz Generator**

`quiz.ts`
Creates 10 high-quality questions.

### 4. **Difficulty Ranker**

`ranker.ts`
Assigns difficulty based on:

* abstraction level
* reasoning depth
* cognitive load
* dependency on other concepts

### 5. **Validator**

`validate.ts`
Cross-checks difficulty with logic rules
→ adjusts if mismatched.

---

# 🔮 **Future Enhancements**

* Auto-generate MCQs with distractors
* Bloom’s Taxonomy–based difficulty scoring
* Export quiz as PDF / JSON
* Teacher dashboard with analytics
* Multi-language support

