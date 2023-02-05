enum Role {
    admin = "admin",
    tester = "tester",
    player = "player",
    user = "user",
}

export default Role;

export function switchRole(role: string) {
    switch (role) {
        case Role.tester:
            return Role.tester;
        case Role.player:
            return Role.player;
        case Role.admin:
            return Role.admin;
        case Role.user:
        default:
            return Role.user;
    }
}
