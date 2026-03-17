const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CV Templates</title>
</head>
<body>
<p>Loading...</p>
</body>
</html>`;

export default function SamplesPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        srcDoc={htmlContent}
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="CV Templates"
        sandbox="allow-scripts"
      />
    </div>
  );
}
