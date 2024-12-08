global.chrome = {
    tabs: {
        query: async () => { throw new Error("Unimplemented. ") }
    },
    runtime: {
        sendMessage: async () => { throw new Error("Unimplemented. ") }
    }
}