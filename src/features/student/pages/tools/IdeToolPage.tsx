import { useEffect } from 'react';
import { SimulationProvider } from '@/features/student/components/simulations';
import Ide from '@/features/student/components/tools/Ide';

const TOOL_PYTHON_CONTENT = `# QYVORA — Python Exercise
# Complete the function below and run the code.

def greet(name):
    """Return a greeting string."""
    return f"Hello, {name}! Welcome to QYVORA."

# Test your function
message = greet("Hacker")
print(message)

# TODO: Try modifying the function to uppercase the name
# TODO: Add a second parameter for the course name
`;

const TOOL_JS_CONTENT = `// QYVORA — JavaScript Exercise
// Complete the function below and run the code.

function fibonacci(n) {
  // Return the first n numbers of the Fibonacci sequence
  const result = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }
  return result;
}

console.log(fibonacci(10));
// Expected: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
`;

const TOOL_BASH_CONTENT = `#!/bin/bash
# QYVORA — Bash Exercise
# Complete the script below and run the code.

echo "=== System Info ==="
echo "User: $(whoami)"
echo "Date: $(date)"
echo "Current dir: $(pwd)"

# TODO: List files in the current directory
# TODO: Create a new directory called "lab_results"
# TODO: Save the system info to a file
`;

const IdeToolPage = () => {
  useEffect(() => {
    document.title = 'IDE — QYVORA Tools';
  }, []);

  return (
    <SimulationProvider>
      <Ide
        open={true}
        onOpenChange={() => window.close()}
        title="Code Playground"
        standalone
        terminalContext={{ type: 'dashboard' }}
        files={[
          { id: 'main', name: 'main.py', language: 'python', content: TOOL_PYTHON_CONTENT },
          { id: 'app', name: 'app.js', language: 'javascript', content: TOOL_JS_CONTENT },
          { id: 'script', name: 'script.sh', language: 'bash', content: TOOL_BASH_CONTENT },
        ]}
      />
    </SimulationProvider>
  );
};

export default IdeToolPage;
