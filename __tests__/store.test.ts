import { rootReducer } from '../src/services/store';

describe('rootReducer', () => {
  it('Проверка возврата в начальное состояние при неизвестном экшене', () => {
    // Получаем фактическое начальное состояние (стандартный механизм Redux)
    const actualInitialState = rootReducer(undefined, { type: '@@INIT' });

    // Имитируем обработку неизвестного экшена
    const stateAfterUnknownAction = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    // Проверяем, что состояние после неизвестного экшена идентично начальному
    expect(stateAfterUnknownAction).toEqual(actualInitialState);
  });
});
