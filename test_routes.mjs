const routes = [
  '/',
  '/search',
  '/search?q=AI+hackathon+near+Mysuru',
  '/search?category=COLLEGES&district=Bengaluru+Urban',
  '/hackathons/karnataka-genai-innovation-hackathon-2026',
  '/hackathons/rvce-8th-mile-national-tech-hackathon',
  '/institutions',
  '/institutions/inst-rvce-01',
  '/institutions/inst-nitk-02',
  '/companies',
  '/companies/comp-infosys-01',
  '/companies/comp-phonepe-03',
  '/communities',
  '/login',
  '/login/student',
  '/login/organizer',
  '/login/admin',
  '/dashboard/student',
  '/dashboard/organizer',
  '/admin',
];

async function runTests() {
  console.log("=== RUNNING BROWSER/HTTP ROUTE TESTS ===");
  let passed = 0;
  let failed = 0;

  for (const path of routes) {
    const url = `http://localhost:3000${path}`;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        console.log(`[PASS] ${path} -> HTTP 200 OK (${res.headers.get('content-type')})`);
        passed++;
      } else {
        console.error(`[FAIL] ${path} -> HTTP ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${path} -> ${err.message}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} PASSED, ${failed} FAILED across ${routes.length} routes.`);
  if (failed > 0) process.exit(1);
}

runTests();
