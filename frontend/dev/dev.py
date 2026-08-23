from livereload import Server

server = Server()

server.watch("./index.html")
server.watch("./style/**/*.css")
server.watch("./js/**/*.js")

server.serve(
    root=".",
    host="127.0.0.1",
    port=3333,
    open_url_delay=1
)