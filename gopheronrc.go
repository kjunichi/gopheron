package main

import (
	"fmt"
	"github.com/zhouhui8915/go-socket.io-client"
	"log"
	"os"
)

func main() {
	fmt.Println("os.Args: ", os.Args)
	fmt.Println("msg = ", os.Args[1])
	opts := &socketio_client.Options{
		Transport: "websocket",
		Query:     make(map[string]string),
	}

	uri := "http://localhost:5050/socket.io/"

	client, err := socketio_client.NewClient(uri, opts)
	if err != nil {
		log.Printf("NewClient error:%v\n", err)
		return
	}

	client.On("error", func() {
		log.Printf("on error\n")
	})
	client.On("connection", func() {
		log.Printf("on connect\n")
	})
	client.On("disconnection", func() {
		log.Printf("on disconnect\n")
	})

	client.Emit("gopher send", os.Args[1])

}
