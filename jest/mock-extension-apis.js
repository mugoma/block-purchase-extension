global.chrome = {
    tabs: {
        query: async () => { throw new Error("Unimplemented. ") },
        sendMessage: async () => { throw new Error("Unimplemented. ") }
    },
    runtime: {
        sendMessage: async () => { throw new Error("Unimplemented. ") }
    },
    storage: {
        local: {
            get: async () => { throw new Error("Unimplemented. ") },
            set: async () => { throw new Error("Unimplemented. ") }
        }
    }
}