import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => {
    const res = await fetch(process.env.BURGER_API_URL + '/ingredients');
    if (!res.ok) throw new Error('Ошибка загрузки ингредиентов');
    const data = await res.json();
    return data.data.map((item: any) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      type: item.type,
      image: item.image,
      image_large: item.image_large,
      image_mobile: item.image_mobile,
      proteins: item.proteins,
      fat: item.fat,
      carbohydrates: item.carbohydrates,
      calories: item.calories
    })) as TIngredient[];
  }
);

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.ingredients = action.payload;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ингредиенты';
      });
  }
});

export const { setIngredients, setLoading, setError } =
  ingredientsSlice.actions;
export default ingredientsSlice.reducer;
