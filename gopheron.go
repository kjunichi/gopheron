package main

import (
	"fmt"
	"github.com/googollee/go-socket.io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
  "path"
)

func socketIoServer(port int) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		so.Join("gopher")
		so.On("electron start", func(msg string) {
			log.Println("recv electron: " + msg)
		})

		so.On("gopher", func(msg string) {
			//so.Emit("news","こんにちは");
		})

		so.On("gopher send", func(msg string) {
			log.Println("gopher send :", msg)
			so.BroadcastTo("gopher", "news", msg)
			so.Emit("gopher recv", "send: ok")
		})
		so.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./asset")))
	log.Println("Serving at localhost:" + strconv.Itoa(port) + "...")
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(port), nil))
}

func startElectron() {
	gopheronPath := path.Dir(os.Args[0])
	out, err := exec.Command("electron", "--with-golang", gopheronPath).Output()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	fmt.Println(string(out))
}
func main() {
	go socketIoServer(5050)
	startElectron()
	//time.Sleep(10000 * time.Second)
}
