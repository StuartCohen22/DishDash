"""Seed script to populate the database with demo data."""

import asyncio
from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import select

from app.database import async_session_maker
from app.models.meal_plan import MealPlan, PlannedMeal
from app.models.recipe import Ingredient, Recipe
from app.models.shopping import ShoppingItem, ShoppingList
from app.models.user import User
from app.services.auth import AuthService
from app.utils.enums import IngredientUnit, MealType, RecipeCategory

# Demo users
DEMO_USERS = [
    {"email": "demo@dishdash.app", "password": "demo1234", "name": "Demo User"},
    {"email": "chef@dishdash.app", "password": "chef1234", "name": "Chef Example"},
]

# Demo recipes with realistic ingredients
DEMO_RECIPES = [
    {
        "name": "Classic Buttermilk Pancakes",
        "description": "Fluffy homemade pancakes perfect for a lazy weekend breakfast.",
        "instructions": """1. In a large bowl, whisk together flour, sugar, baking powder, baking soda, and salt.
2. In another bowl, whisk together buttermilk, melted butter, eggs, and vanilla.
3. Pour wet ingredients into dry ingredients and stir until just combined (lumps are okay).
4. Heat a griddle or non-stick pan over medium heat and lightly grease.
5. Pour 1/4 cup batter per pancake onto the griddle.
6. Cook until bubbles form on surface, then flip and cook until golden brown.
7. Serve immediately with maple syrup and fresh berries.""",
        "prep_time_minutes": 10,
        "cook_time_minutes": 20,
        "servings": 4,
        "category": RecipeCategory.BREAKFAST,
        "ingredients": [
            {"name": "All-purpose flour", "quantity": Decimal("2"), "unit": IngredientUnit.CUP},
            {"name": "Sugar", "quantity": Decimal("2"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Baking powder", "quantity": Decimal("2"), "unit": IngredientUnit.TEASPOON},
            {"name": "Baking soda", "quantity": Decimal("1"), "unit": IngredientUnit.TEASPOON},
            {"name": "Salt", "quantity": Decimal("0.5"), "unit": IngredientUnit.TEASPOON},
            {"name": "Buttermilk", "quantity": Decimal("2"), "unit": IngredientUnit.CUP},
            {"name": "Butter, melted", "quantity": Decimal("4"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Eggs", "quantity": Decimal("2"), "unit": IngredientUnit.WHOLE},
            {"name": "Vanilla extract", "quantity": Decimal("1"), "unit": IngredientUnit.TEASPOON},
        ],
    },
    {
        "name": "Berry Smoothie Bowl",
        "description": "A refreshing and nutritious smoothie bowl topped with fresh fruits and granola.",
        "instructions": """1. Add frozen berries, banana, Greek yogurt, and almond milk to a blender.
2. Blend until thick and smooth (should be thicker than a regular smoothie).
3. Pour into a bowl.
4. Arrange toppings in rows: sliced banana, fresh berries, granola, and chia seeds.
5. Drizzle with honey if desired.
6. Serve immediately.""",
        "prep_time_minutes": 10,
        "cook_time_minutes": 0,
        "servings": 2,
        "category": RecipeCategory.BREAKFAST,
        "ingredients": [
            {"name": "Frozen mixed berries", "quantity": Decimal("2"), "unit": IngredientUnit.CUP},
            {"name": "Banana, frozen", "quantity": Decimal("1"), "unit": IngredientUnit.WHOLE},
            {"name": "Greek yogurt", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Almond milk", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Granola", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Fresh strawberries", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Chia seeds", "quantity": Decimal("1"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Honey", "quantity": Decimal("1"), "unit": IngredientUnit.TABLESPOON},
        ],
    },
    {
        "name": "Grilled Chicken Caesar Salad",
        "description": "Classic Caesar salad with grilled chicken breast and homemade dressing.",
        "instructions": """1. Season chicken breasts with salt, pepper, and olive oil.
2. Grill chicken over medium-high heat for 6-7 minutes per side until cooked through.
3. Let chicken rest for 5 minutes, then slice.
4. For dressing: whisk together mayonnaise, lemon juice, Worcestershire sauce, garlic, and anchovy paste.
5. Toss romaine lettuce with dressing.
6. Top with sliced chicken, croutons, and shaved Parmesan.
7. Add freshly ground black pepper and serve.""",
        "prep_time_minutes": 15,
        "cook_time_minutes": 15,
        "servings": 4,
        "category": RecipeCategory.LUNCH,
        "ingredients": [
            {"name": "Chicken breast", "quantity": Decimal("1.5"), "unit": IngredientUnit.POUND},
            {"name": "Romaine lettuce", "quantity": Decimal("2"), "unit": IngredientUnit.WHOLE},
            {"name": "Parmesan cheese, shaved", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Croutons", "quantity": Decimal("1"), "unit": IngredientUnit.CUP},
            {"name": "Mayonnaise", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Lemon juice", "quantity": Decimal("2"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Worcestershire sauce", "quantity": Decimal("1"), "unit": IngredientUnit.TEASPOON},
            {"name": "Garlic cloves, minced", "quantity": Decimal("2"), "unit": IngredientUnit.CLOVE},
            {"name": "Olive oil", "quantity": Decimal("2"), "unit": IngredientUnit.TABLESPOON},
        ],
    },
    {
        "name": "Tomato Basil Soup",
        "description": "Creamy tomato soup with fresh basil, perfect with grilled cheese.",
        "instructions": """1. Heat olive oil in a large pot over medium heat.
2. Sauté onion and garlic until softened, about 5 minutes.
3. Add canned tomatoes, vegetable broth, and sugar.
4. Bring to a boil, then reduce heat and simmer for 20 minutes.
5. Remove from heat and stir in heavy cream and fresh basil.
6. Use an immersion blender to puree until smooth.
7. Season with salt and pepper to taste.
8. Serve hot, garnished with fresh basil and a drizzle of cream.""",
        "prep_time_minutes": 10,
        "cook_time_minutes": 30,
        "servings": 6,
        "category": RecipeCategory.LUNCH,
        "ingredients": [
            {"name": "Canned crushed tomatoes", "quantity": Decimal("28"), "unit": IngredientUnit.OUNCE},
            {"name": "Vegetable broth", "quantity": Decimal("2"), "unit": IngredientUnit.CUP},
            {"name": "Onion, diced", "quantity": Decimal("1"), "unit": IngredientUnit.WHOLE},
            {"name": "Garlic cloves, minced", "quantity": Decimal("3"), "unit": IngredientUnit.CLOVE},
            {"name": "Heavy cream", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Fresh basil leaves", "quantity": Decimal("0.25"), "unit": IngredientUnit.CUP},
            {"name": "Olive oil", "quantity": Decimal("2"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Sugar", "quantity": Decimal("1"), "unit": IngredientUnit.TEASPOON},
            {"name": "Salt", "quantity": Decimal("1"), "unit": IngredientUnit.TEASPOON},
        ],
    },
    {
        "name": "Spaghetti Carbonara",
        "description": "Authentic Italian pasta with crispy pancetta and creamy egg sauce.",
        "instructions": """1. Cook spaghetti according to package directions. Reserve 1 cup pasta water before draining.
2. While pasta cooks, cut pancetta into small cubes and cook in a large skillet until crispy.
3. In a bowl, whisk together eggs, egg yolks, grated Pecorino, and black pepper.
4. Add drained pasta to the skillet with pancetta (heat off).
5. Quickly toss pasta while pouring in the egg mixture, adding pasta water as needed.
6. The residual heat will cook the eggs into a creamy sauce.
7. Serve immediately with extra cheese and black pepper.""",
        "prep_time_minutes": 10,
        "cook_time_minutes": 20,
        "servings": 4,
        "category": RecipeCategory.DINNER,
        "ingredients": [
            {"name": "Spaghetti", "quantity": Decimal("1"), "unit": IngredientUnit.POUND},
            {"name": "Pancetta", "quantity": Decimal("8"), "unit": IngredientUnit.OUNCE},
            {"name": "Eggs", "quantity": Decimal("3"), "unit": IngredientUnit.WHOLE},
            {"name": "Egg yolks", "quantity": Decimal("2"), "unit": IngredientUnit.WHOLE},
            {"name": "Pecorino Romano, grated", "quantity": Decimal("1"), "unit": IngredientUnit.CUP},
            {"name": "Black pepper", "quantity": Decimal("2"), "unit": IngredientUnit.TEASPOON},
            {"name": "Salt", "quantity": Decimal("1"), "unit": IngredientUnit.TABLESPOON},
        ],
    },
    {
        "name": "Beef Stir-Fry with Vegetables",
        "description": "Quick and flavorful stir-fry with tender beef and crisp vegetables.",
        "instructions": """1. Slice beef against the grain into thin strips. Marinate in soy sauce and cornstarch for 15 minutes.
2. Prepare all vegetables: slice bell peppers, broccoli florets, snap peas.
3. Heat oil in a wok over high heat until smoking.
4. Stir-fry beef in batches until browned. Remove and set aside.
5. Add more oil and stir-fry vegetables for 2-3 minutes until crisp-tender.
6. Return beef to wok. Add sauce (soy sauce, oyster sauce, garlic, ginger).
7. Toss everything together and cook for 1 minute.
8. Serve over steamed rice.""",
        "prep_time_minutes": 20,
        "cook_time_minutes": 15,
        "servings": 4,
        "category": RecipeCategory.DINNER,
        "ingredients": [
            {"name": "Beef sirloin", "quantity": Decimal("1"), "unit": IngredientUnit.POUND},
            {"name": "Bell peppers, mixed colors", "quantity": Decimal("2"), "unit": IngredientUnit.WHOLE},
            {"name": "Broccoli florets", "quantity": Decimal("2"), "unit": IngredientUnit.CUP},
            {"name": "Snap peas", "quantity": Decimal("1"), "unit": IngredientUnit.CUP},
            {"name": "Soy sauce", "quantity": Decimal("3"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Oyster sauce", "quantity": Decimal("2"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Garlic cloves, minced", "quantity": Decimal("3"), "unit": IngredientUnit.CLOVE},
            {"name": "Fresh ginger, minced", "quantity": Decimal("1"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Vegetable oil", "quantity": Decimal("3"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Cornstarch", "quantity": Decimal("1"), "unit": IngredientUnit.TABLESPOON},
        ],
    },
    {
        "name": "Chicken Tacos",
        "description": "Seasoned chicken tacos with fresh toppings and homemade salsa.",
        "instructions": """1. Season chicken thighs with taco seasoning, cumin, chili powder, garlic powder, and salt.
2. Cook chicken in a skillet over medium heat until cooked through, about 6-8 minutes per side.
3. Let rest 5 minutes, then shred or slice.
4. Warm tortillas in a dry skillet or directly over gas flame.
5. For salsa: combine diced tomatoes, onion, cilantro, lime juice, and jalapeño.
6. Assemble tacos: tortilla, chicken, salsa, cheese, lettuce, and sour cream.
7. Serve with lime wedges.""",
        "prep_time_minutes": 20,
        "cook_time_minutes": 15,
        "servings": 4,
        "category": RecipeCategory.DINNER,
        "ingredients": [
            {"name": "Chicken thighs", "quantity": Decimal("1.5"), "unit": IngredientUnit.POUND},
            {"name": "Small corn tortillas", "quantity": Decimal("12"), "unit": IngredientUnit.PIECE},
            {"name": "Roma tomatoes", "quantity": Decimal("3"), "unit": IngredientUnit.WHOLE},
            {"name": "White onion", "quantity": Decimal("0.5"), "unit": IngredientUnit.WHOLE},
            {"name": "Fresh cilantro", "quantity": Decimal("0.25"), "unit": IngredientUnit.CUP},
            {"name": "Lime", "quantity": Decimal("2"), "unit": IngredientUnit.WHOLE},
            {"name": "Jalapeño pepper", "quantity": Decimal("1"), "unit": IngredientUnit.WHOLE},
            {"name": "Shredded Mexican cheese", "quantity": Decimal("1"), "unit": IngredientUnit.CUP},
            {"name": "Sour cream", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Taco seasoning", "quantity": Decimal("2"), "unit": IngredientUnit.TABLESPOON},
        ],
    },
    {
        "name": "Fudgy Chocolate Brownies",
        "description": "Rich, dense chocolate brownies with a crackly top.",
        "instructions": """1. Preheat oven to 350°F (175°C). Line an 8x8 inch pan with parchment paper.
2. Melt butter and chocolate together in a double boiler or microwave, stirring until smooth.
3. Whisk in sugar until combined.
4. Add eggs one at a time, whisking well after each addition.
5. Add vanilla extract.
6. Fold in flour, cocoa powder, and salt until just combined.
7. Pour batter into prepared pan and spread evenly.
8. Bake for 25-30 minutes until a toothpick comes out with moist crumbs.
9. Cool completely before cutting into squares.""",
        "prep_time_minutes": 15,
        "cook_time_minutes": 30,
        "servings": 9,
        "category": RecipeCategory.DESSERT,
        "ingredients": [
            {"name": "Butter", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Dark chocolate", "quantity": Decimal("4"), "unit": IngredientUnit.OUNCE},
            {"name": "Sugar", "quantity": Decimal("1"), "unit": IngredientUnit.CUP},
            {"name": "Eggs", "quantity": Decimal("2"), "unit": IngredientUnit.WHOLE},
            {"name": "Vanilla extract", "quantity": Decimal("1"), "unit": IngredientUnit.TEASPOON},
            {"name": "All-purpose flour", "quantity": Decimal("0.5"), "unit": IngredientUnit.CUP},
            {"name": "Cocoa powder", "quantity": Decimal("0.25"), "unit": IngredientUnit.CUP},
            {"name": "Salt", "quantity": Decimal("0.25"), "unit": IngredientUnit.TEASPOON},
        ],
    },
    {
        "name": "Classic Hummus",
        "description": "Creamy homemade hummus with tahini and lemon.",
        "instructions": """1. Drain and rinse chickpeas. For extra smooth hummus, rub to remove skins.
2. Add chickpeas to food processor with tahini, lemon juice, garlic, and salt.
3. Process while streaming in olive oil and ice water.
4. Blend for 4-5 minutes until very smooth and creamy.
5. Taste and adjust seasoning (more lemon, salt, or garlic as needed).
6. Transfer to a serving bowl.
7. Create a well in the center, drizzle with olive oil, and sprinkle with paprika.
8. Serve with pita bread and vegetables.""",
        "prep_time_minutes": 10,
        "cook_time_minutes": 0,
        "servings": 8,
        "category": RecipeCategory.SNACK,
        "ingredients": [
            {"name": "Canned chickpeas", "quantity": Decimal("15"), "unit": IngredientUnit.OUNCE},
            {"name": "Tahini", "quantity": Decimal("0.33"), "unit": IngredientUnit.CUP},
            {"name": "Lemon juice", "quantity": Decimal("3"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Garlic cloves", "quantity": Decimal("2"), "unit": IngredientUnit.CLOVE},
            {"name": "Olive oil", "quantity": Decimal("3"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Ice water", "quantity": Decimal("3"), "unit": IngredientUnit.TABLESPOON},
            {"name": "Salt", "quantity": Decimal("0.5"), "unit": IngredientUnit.TEASPOON},
            {"name": "Paprika", "quantity": Decimal("0.5"), "unit": IngredientUnit.TEASPOON},
        ],
    },
]


async def seed_database():
    """Seed the database with demo data."""
    print("Starting database seed...")

    async with async_session_maker() as db:
        # Check if data already exists
        result = await db.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            print("Database already has data. Skipping seed.")
            return

        # Create users
        users = []
        for user_data in DEMO_USERS:
            user = User(
                email=user_data["email"],
                password_hash=AuthService.get_password_hash(user_data["password"]),
                name=user_data["name"],
            )
            db.add(user)
            users.append(user)
            print(f"Created user: {user_data['email']}")

        await db.flush()

        # Create recipes for the first user
        demo_user = users[0]
        recipes = []

        for idx, recipe_data in enumerate(DEMO_RECIPES):
            recipe = Recipe(
                user_id=demo_user.id,
                name=recipe_data["name"],
                description=recipe_data["description"],
                instructions=recipe_data["instructions"],
                prep_time_minutes=recipe_data["prep_time_minutes"],
                cook_time_minutes=recipe_data["cook_time_minutes"],
                servings=recipe_data["servings"],
                category=recipe_data["category"],
            )
            db.add(recipe)
            await db.flush()

            # Add ingredients
            for ing_idx, ing_data in enumerate(recipe_data["ingredients"]):
                ingredient = Ingredient(
                    recipe_id=recipe.id,
                    name=ing_data["name"],
                    quantity=ing_data["quantity"],
                    unit=ing_data["unit"],
                    order_index=ing_idx,
                )
                db.add(ingredient)

            recipes.append(recipe)
            print(f"Created recipe: {recipe_data['name']}")

        await db.flush()

        # Create a sample meal plan for the demo user
        next_monday = date.today() + timedelta(days=(7 - date.today().weekday()) % 7)
        meal_plan = MealPlan(
            user_id=demo_user.id,
            name="My Weekly Meal Plan",
            week_start_date=next_monday,
        )
        db.add(meal_plan)
        await db.flush()
        print(f"Created meal plan: {meal_plan.name}")

        # Add planned meals (some recipes to different days)
        planned_meals_data = [
            (0, MealType.BREAKFAST, 0),  # Monday breakfast - Pancakes
            (0, MealType.LUNCH, 2),  # Monday lunch - Caesar Salad
            (0, MealType.DINNER, 4),  # Monday dinner - Carbonara
            (1, MealType.BREAKFAST, 1),  # Tuesday breakfast - Smoothie Bowl
            (1, MealType.DINNER, 5),  # Tuesday dinner - Stir-fry
            (2, MealType.LUNCH, 3),  # Wednesday lunch - Tomato Soup
            (2, MealType.DINNER, 6),  # Wednesday dinner - Tacos
            (3, MealType.BREAKFAST, 0),  # Thursday breakfast - Pancakes
            (4, MealType.SNACK, 8),  # Friday snack - Hummus
            (5, MealType.DESSERT, 7),  # Saturday dessert - Brownies
        ]

        for day, meal_type, recipe_idx in planned_meals_data:
            if recipe_idx < len(recipes):
                planned_meal = PlannedMeal(
                    meal_plan_id=meal_plan.id,
                    recipe_id=recipes[recipe_idx].id,
                    day_of_week=day,
                    meal_type=meal_type,
                )
                db.add(planned_meal)

        await db.flush()
        print("Added planned meals to meal plan")

        # Create a shopping list for the meal plan
        shopping_list = ShoppingList(meal_plan_id=meal_plan.id)
        db.add(shopping_list)
        await db.flush()

        # Add some shopping items
        shopping_items = [
            ("All-purpose flour", Decimal("2.5"), "cup", False),
            ("Eggs", Decimal("7"), "whole", False),
            ("Butter", Decimal("0.75"), "cup", True),  # Already purchased
            ("Chicken breast", Decimal("1.5"), "pound", False),
            ("Romaine lettuce", Decimal("2"), "whole", False),
            ("Spaghetti", Decimal("1"), "pound", False),
            ("Pancetta", Decimal("8"), "ounce", False),
        ]

        for name, qty, unit, purchased in shopping_items:
            item = ShoppingItem(
                shopping_list_id=shopping_list.id,
                ingredient_name=name,
                quantity=qty,
                unit=unit,
                is_purchased=purchased,
            )
            db.add(item)

        await db.commit()
        print("Created shopping list with items")

    print("\nSeed completed successfully!")
    print(f"\nDemo accounts:")
    for user_data in DEMO_USERS:
        print(f"  Email: {user_data['email']}, Password: {user_data['password']}")


if __name__ == "__main__":
    asyncio.run(seed_database())
