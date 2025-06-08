package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"
    "os/exec"
    "path/filepath"
    "sync"
)

var (
    slidevProcess *exec.Cmd
    mu            sync.Mutex
)

func listJSONNames(dir string) ([]string, error) {
    entries, err := os.ReadDir(dir)
    if err != nil {
        return nil, err
    }
    var names []string
    for _, e := range entries {
        if filepath.Ext(e.Name()) == ".json" {
            names = append(names, e.Name()[:len(e.Name())-5])
        }
    }
    return names, nil
}

func generateSlides(w http.ResponseWriter, r *http.Request) {
    type reqBody struct {
        Product        string `json:"product"`
        Template       string `json:"template"`
        IncludeRecent  bool   `json:"includeRecent"`
        IncludeSelected bool  `json:"includeSelected"`
    }
    var body reqBody
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, "invalid request", http.StatusBadRequest)
        return
    }
    if body.Product == "" {
        body.Product = "example"
    }
    if body.Template == "" {
        body.Template = "product-overview"
    }
    recent := "false"
    selected := "false"
    if body.IncludeRecent {
        recent = "true"
    }
    if body.IncludeSelected {
        selected = "true"
    }

    cmd := exec.Command("npx", "ts-node", "scripts/generateSlides.ts", body.Product, body.Template, recent, selected)
    out, err := cmd.CombinedOutput()
    if err != nil {
        log.Println(string(out))
        http.Error(w, "Failed to generate slides", http.StatusInternalServerError)
        return
    }

    mu.Lock()
    if slidevProcess != nil {
        slidevProcess.Process.Kill()
    }
    slidevProcess = exec.Command("npx", "slidev", "slides.md")
    slidevProcess.Stdout = os.Stdout
    slidevProcess.Stderr = os.Stderr
    slidevProcess.Start()
    mu.Unlock()

    slidevProcess.Wait()
    mu.Lock()
    slidevProcess = nil
    mu.Unlock()

    json.NewEncoder(w).Encode(map[string]string{"message": string(out)})
}

func generateSnapshot(w http.ResponseWriter, r *http.Request) {
    type reqBody struct {
        Snapshot string `json:"snapshot"`
        Template string `json:"template"`
    }
    var body reqBody
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, "invalid request", http.StatusBadRequest)
        return
    }
    if body.Snapshot == "" {
        body.Snapshot = "example"
    }
    if body.Template == "" {
        body.Template = "snapshot-report"
    }

    cmd := exec.Command("npx", "ts-node", "scripts/generateSnapshotSlides.ts", body.Snapshot, body.Template)
    out, err := cmd.CombinedOutput()
    if err != nil {
        log.Println(string(out))
        http.Error(w, "Failed to generate snapshot", http.StatusInternalServerError)
        return
    }

    mu.Lock()
    if slidevProcess != nil {
        slidevProcess.Process.Kill()
    }
    slidevProcess = exec.Command("npx", "slidev", "snapshot-slides.md")
    slidevProcess.Stdout = os.Stdout
    slidevProcess.Stderr = os.Stderr
    slidevProcess.Start()
    mu.Unlock()

    slidevProcess.Wait()
    mu.Lock()
    slidevProcess = nil
    mu.Unlock()

    json.NewEncoder(w).Encode(map[string]string{"message": string(out)})
}

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    fsys := http.FileServer(http.Dir("public"))

    http.HandleFunc("/snapshots", func(w http.ResponseWriter, r *http.Request) {
        names, err := listJSONNames("snapshots")
        if err != nil {
            http.Error(w, "Failed to load snapshots", http.StatusInternalServerError)
            return
        }
        json.NewEncoder(w).Encode(names)
    })

    http.HandleFunc("/products", func(w http.ResponseWriter, r *http.Request) {
        names, err := listJSONNames("products")
        if err != nil {
            http.Error(w, "Failed to load products", http.StatusInternalServerError)
            return
        }
        json.NewEncoder(w).Encode(names)
    })

    http.HandleFunc("/generate", generateSlides)
    http.HandleFunc("/generate-snapshot", generateSnapshot)

    http.Handle("/", fsys)

    log.Printf("Server listening on http://localhost:%s", port)
    log.Fatal(http.ListenAndServe(":"+port, nil))
}
