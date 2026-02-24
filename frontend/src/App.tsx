function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
              Whispers Of The White Moon
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to the community
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 space-y-4">
          <p className="text-lg">
            Welcome! The full application features are currently being updated.
          </p>
          <p className="text-sm text-muted-foreground">
            Stay tuned for exciting new content.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
