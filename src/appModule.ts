import {Container} from 'inversify';
import {FileEntry, ROOT_DIR} from '@src/store/types';
import getDecorators from 'inversify-inject-decorators';

export const appSymbols = {
  ROOT_DIR: Symbol.for('ROOT_DIR'),
};

export const appContainer = new Container({
  defaultScope: 'Singleton',
  autoBindInjectable: true,
});

appContainer.bind<FileEntry>(appSymbols.ROOT_DIR).toConstantValue(ROOT_DIR);

export const inject = getDecorators(appContainer).lazyInject;
