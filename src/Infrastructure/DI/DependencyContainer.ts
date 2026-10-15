import "reflect-metadata";
import { container } from "tsyringe";

import { RepositoryRegistry } from "./RepositoryRegistry";
import { ServiceRegistry } from "./ServiceRegistry";
import { UseCaseRegistry } from "./UseCaseRegistry";
import { ControllerRegistry } from "./ControllerRegistry";

export class DependencyContainer {

    static registerDependencies(): void {
        RepositoryRegistry.register();
        ServiceRegistry.register();
        UseCaseRegistry.register();
        ControllerRegistry.register();
    }

    static getContainer() {
        return container;
    }
}